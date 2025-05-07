import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";


const uri = process.env.MONGODB_URI || "";
let client = new MongoClient(uri);
const dbName = process.env.DB_NAME || "evaluacionedificiositcr";
const collectionName = process.env.COLLECTION_NAME || "evaluaciones";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ codigoEvaluacion: string }> },
) {
  try {
    //NECESITO AWAIT LOS PARAMAS

    let { codigoEvaluacion } = await params;

    codigoEvaluacion = codigoEvaluacion.trim();

    if (!ObjectId.isValid(codigoEvaluacion)) {
      return NextResponse.json({
        status: "error",
        message: "El parámetro 'codigoEvaluacion' no es un ObjectId válido.",
      }, { status: 400 });
    }

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const documento = await collection.findOne({ _id: new ObjectId(codigoEvaluacion) });

    if (!documento) {
      return NextResponse.json({
        status: "error",
        message: "Documento no encontrado",
      }, { status: 404 });
    }

    return NextResponse.json({
      status: "success",
      data: documento,
    });
  } catch (error) {
    console.error("MongoDB error:", error);
    return NextResponse.json({
      status: "error",
      message: "Error al obtener documento",
      error: error instanceof Error ? error.message : "Error desconocido",
    }, { status: 500 });
  } finally {
    await client.close();
  }
}
