import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI ?? '';
const client = new MongoClient(uri);
const dbName = process.env.DB_NAME ?? "evaluacionedificiositcr";
const collectionName = "documentos_proyectos";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    
    const { id } = await params;
    
    // Find all PDFs for the specific project
    const documentos = await collection.find({ projectId: id }).toArray();
    
    console.log(`Found ${documentos.length} documents for project ${id}`);

    return NextResponse.json({
      status: "success",
      data: documentos
    });
  } catch (error) {
    console.error("Error al obtener documentos del proyecto:", error);
    return NextResponse.json({
      status: "error",
      message: "Error al obtener documentos del proyecto",
      error: error instanceof Error ? error.message : "Error desconocido"
    }, { status: 500 });
  } finally {
    await client.close();
  }
}
