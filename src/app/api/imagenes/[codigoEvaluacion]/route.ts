import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

interface ImagenDoc {
  url: string;
  evaluationId: string;
}

const uri = process.env.MONGODB_URI ?? "";
const client = new MongoClient(uri);
const dbName = process.env.DB_NAME ?? "evaluacionedificiositcr";
const collectionName = "imagenes";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ codigoEvaluacion: string }> }
  ) {
    try {
      let { codigoEvaluacion } = await params;
  
      codigoEvaluacion = codigoEvaluacion.trim();
  
      console.log("codigoEvaluacion", codigoEvaluacion);
  
      if (!ObjectId.isValid(codigoEvaluacion)) {
        return NextResponse.json(
          {
            status: "error",
            message: "El parámetro 'codigoEvaluacion' no es un ObjectId válido.",
          },
          { status: 400 }
        );
      }
  
      await client.connect();
      const db = client.db(dbName);
      const collection = db.collection<ImagenDoc>(collectionName);
  
      const imagenes = await collection.find({ evaluationId: codigoEvaluacion }).toArray();
  
      if (imagenes.length === 0) {
        return NextResponse.json(
          {
            status: "error",
            message: "No se encontraron imágenes para el 'codigoEvaluacion' proporcionado.",
          },
          { status: 404 }
        );
      }
  
      const urls: string[] = imagenes.map((img) => img.url).filter((url): url is string => Boolean(url));
  
      return NextResponse.json(urls);
    } catch (error) {
      console.error("MongoDB error:", error);
      return NextResponse.json(
        {
          status: "error",
          message: "Error al obtener las imágenes",
          error: error instanceof Error ? error.message : "Error desconocido",
        },
        { status: 500 }
      );
    } finally {
      await client.close();
    }
  }