import { NextRequest, NextResponse } from "next/server";
import { MongoClient, Document, ObjectId } from "mongodb";
import { Eje, Criterio, Parametro, FormularioProyecto, ApiResponse, Evaluacion, EjeTotal } from "../../../(dashboard)/priorizacion/types";

const uri = process.env.MONGODB_URI ??'';
const client = new MongoClient(uri);
const dbName = process.env.DB_NAME ??"evaluacionedificiositcr";
const collectionName = "proyectos";
const db = client.db(dbName);
const collection = db.collection(collectionName);

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    
    const { id } = await params;
    
    const proyecto = await collection.findOne({ _id: new ObjectId(id) });
    
    if (!proyecto) {
      return NextResponse.json({
        status: "error",
        message: "Proyecto no encontrado"
      }, { status: 404 });
    }

    console.log("Proyecto obtenido desde la base de datos:", proyecto);

    return NextResponse.json({
      status: "success",
      data: proyecto
    });
  } catch (error) {
    console.error("Error al obtener los proyectos:", error);
    return NextResponse.json({
      status: "error",
      message: "Error al obtener los proyectos",
      error: error instanceof Error ? error.message : "Error desconocido"
    }, { status: 500 });
  } finally {
    await client.close();
  }
}