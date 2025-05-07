import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI || "";
let client = new MongoClient(uri);
const dbName = process.env.DB_NAME || "evaluacionedificiositcr";
const collectionName = "imagenes";

export async function GET(request: Request) {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Obtener todas las imágenes
        const allImages = await collection.find({}).toArray();
        console.log("allImages", allImages);
        return NextResponse.json({
            status: "success",
            data: allImages
        });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({
            status: "error",
            message: "Error al obtener las imágenes",
            error: error instanceof Error ? error.message : "Error desconocido"
        }, { status: 500 });
    } finally {
        await client.close();
    }
}
