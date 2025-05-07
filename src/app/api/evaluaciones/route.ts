import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI ??'';
const client = new MongoClient(uri);
const dbName = process.env.DB_NAME ??"evaluacionedificiositcr";
const collectionName = process.env.COLLECTION_NAME ??"evaluaciones";
const db = client.db(dbName);
const collection = db.collection(collectionName);

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

export async function GET() {
    try {
        await client.connect();
        
        // Get all documents from the collection
        const documents = await collection.find({}).toArray();
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

