import { NextRequest, NextResponse } from "next/server";
import { MongoClient, Document } from "mongodb";
import { Eje, Criterio, Parametro, FormularioProyecto, ApiResponse, Evaluacion, EjeTotal } from "../../(dashboard)/priorizacion/types";

const uri = process.env.MONGODB_URI ??'';
const client = new MongoClient(uri);
const dbName = process.env.DB_NAME ??"evaluacionedificiositcr";
const collectionName = "proyectos";
const db = client.db(dbName);
const collection = db.collection(collectionName);

export async function POST(request: NextRequest) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const requestData = await request.json(); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    const proyecto = requestData as FormularioProyecto;
    
    const documentoEvaluacion: Document = {
      ...proyecto,
      createdAt: new Date(),
      estado: "Pendiente"
    };

    console.log("Guardando proyecto:", documentoEvaluacion);

    const result = await collection.insertOne(documentoEvaluacion);
    console.log("Proyecto guardado con ID:", result.insertedId);
    console.log("Resultado de la inserción:", result);

    return NextResponse.json({ 
      status: "success", 
      message: "Proyecto guardado exitosamente",
      insertedId: result.insertedId
    });
  } catch (error) {
    console.error("Error al guardar el proyecto:", error);
    return NextResponse.json({ 
      status: "error", 
      collection: collectionName,
      message: "Error al guardar el proyecto",
      error: error instanceof Error ? error.message : "Error desconocido"
    }, { status: 500 });
  } finally {
    await client.close();
  }
}