import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { MongoClient, type Document } from "mongodb";

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

const uri = process.env.MONGODB_URI ?? '';
const dbName = process.env.DB_NAME ?? "evaluacionedificiositcr";
const collectionName = process.env.COLLECTION_NAME ?? "evaluaciones";

export async function POST(request: NextRequest) {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const requestData = await request.json(); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    const evaluacion = requestData as Evaluacion;
    
    const documentoEvaluacion: Document = {
      ...evaluacion,
      createdAt: new Date(),
      estado: "Pendiente"
    };

    const result = await collection.insertOne(documentoEvaluacion);

    return NextResponse.json({ 
      status: "success", 
      message: "Evaluación guardada exitosamente",
      insertedId: result.insertedId
    });
  } catch (error) {
    console.error("Error al guardar la evaluación:", error);
    return NextResponse.json({ 
      status: "error", 
      message: "Error al guardar la evaluación",
      error: error instanceof Error ? error.message : "Error desconocido"
    }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function GET() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    
    // Get all documents from the collection
    const documents = await collection.find({}).toArray() as unknown as Evaluacion[];
    
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
  } finally {
    await client.close();
  }
}

