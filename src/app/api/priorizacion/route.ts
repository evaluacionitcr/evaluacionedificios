import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { Document } from "mongodb";
import type { FormularioProyecto } from "../../(dashboard)/priorizacion/types";
import clientPromise from "~/lib/mongodb";

const dbName = process.env.DB_NAME ?? "evaluacionedificiositcr";
const collectionName = "proyectos";

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const requestData = await request.json() as unknown; 
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
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const proyectos = await collection.find({}).toArray();

    console.log("Proyectos obtenidos desde la base de datos:", proyectos);

    return NextResponse.json({
      status: "success",
      data: proyectos
    });
  } catch (error) {
    console.error("Error al obtener los proyectos:", error);
    return NextResponse.json({
      status: "error",
      message: "Error al obtener los proyectos",
      error: error instanceof Error ? error.message : "Error desconocido"
    }, { status: 500 });
  }
}