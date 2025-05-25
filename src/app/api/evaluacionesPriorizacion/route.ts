import { NextRequest, NextResponse } from "next/server";
import { MongoClient, Document } from "mongodb";

interface Evaluacion {
  edificio: {
    codigo: string;
    nombre: string;
    campus: string;
    usoActual: string;
    area: number;
    descripcion: string;
  };
  depreciacion: {
    principal: {
      edad: number;
      vidaUtil: number;
      estadoConservacionCoef: number;
      escalaDepreciacion: number;
    };
    remodelacion: {
      edad: number;
      vidaUtil: number;
      estadoConservacionCoef: number;
      porcentaje: number;
      escalaDepreciacion: number;
    };
    puntajeDepreciacionTotal: number;
  };
  componentes: Array<{
    id: number;
    componente: string;
    peso: number;
    existencia: string;
    necesidadIntervencion: number;
    pesoEvaluado: number;
    puntaje: number;
  }>;
  puntajeComponentes: number;
  serviciabilidad: {
    funcionalidadId: number;
    normativaId: number;
    puntajeServiciabilidad: number;
  };
  puntajeTotalEdificio: number;
  comentarios: {
    funcionalidad: string;
    normativa: string;
    componentesCriticos: string;
    mejorasRequeridas: string;
  };
  idEvaluador: string;
}

const uri = process.env.MONGODB_URI ??'';
const client = new MongoClient(uri);
const dbName = process.env.DB_NAME ??"evaluacionedificiositcr";
const collectionName = process.env.COLLECTION_NAME ??"evaluaciones";
const db = client.db(dbName);
const collection = db.collection(collectionName);

export async function GET() {
    try {
        await client.connect();
        
        // Get all documents from the collection
         const documents = await collection.aggregate([
            // Primero ordenamos por código de edificio y por _id descendente
            {
                $sort: { 
                    "edificio.codigo": 1,  // Ordenamiento alfanumérico
                    "_id": -1              // El más reciente primero
                }
            },
            // Agrupamos por código de edificio
            {
                $group: {
                    _id: "$edificio.codigo",
                    latestEvaluation: { $first: "$$ROOT" }  // Tomamos el primer documento de cada grupo
                }
            },
            // Restauramos la estructura original del documento
            {
                $replaceRoot: { newRoot: "$latestEvaluation" }
            }
        ]).toArray() as unknown as Evaluacion[];
        await client.close();
        
        return NextResponse.json({ 
            status: "success", 
            message: "Documents retrieved successfully!",
            data: documents
        });
    } catch (error) {
        console.error("MongoDB error:", error);
        return NextResponse.json({ 
            status: "error", 
            message: "Failed to retrieve documents",
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}

