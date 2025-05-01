import {MongoClient} from 'mongodb';
import { NextResponse } from 'next/server';

const uri = process.env.MONGODB_URI || '';
const client = new MongoClient(uri);
const dbName = "evaluacionedificiositcr";
const collectionName = "evaluaciones";
const db = client.db(dbName);
const collection = db.collection(collectionName);

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

export async function POST() {
    try {
        await client.connect();
        
        // Create a test document
        const testDocument = {
            createdAt: new Date(),
            edificio: "Edificio Test",
            evaluador: "Test User",
            estado: "Pendiente",
            comentarios: "Este es un documento de prueba"
        };

        // Insert the document
        const result = await collection.insertOne(testDocument);
        await client.close();
        
        return NextResponse.json({ 
            status: "success", 
            message: "Document inserted successfully!",
            insertedId: result.insertedId
        });
    } catch (error) {
        console.error("MongoDB insertion error:", error);
        return NextResponse.json({ 
            status: "error", 
            message: "Failed to insert document",
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}



