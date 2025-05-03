import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || '';
const client = new MongoClient(uri);
const dbName = process.env.DB_NAME || "evaluacionedificiositcr";
const collectionName = process.env.COLLECTION_NAME || "evaluaciones";

export async function POST(request: NextRequest) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const evaluacion = await request.json();
    
    const documentoEvaluacion = {
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