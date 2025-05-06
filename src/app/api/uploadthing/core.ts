import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { MongoClient } from "mongodb";

// Create a cached connection variable
let cachedClient: MongoClient | null = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  const uri = process.env.MONGODB_URI || '';
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    cachedClient = client;
    return client;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 40,
    },
  })
    .input(
      z.object({
        evaluationId: z.string().optional(),
        description: z.string().optional(),
      }),
    )
    .middleware(async ({ input }) => {
      const user = await auth();

      if (!user.userId) {
        throw new Error("Unauthorized");
      }

      return {
        userId: user.userId,
        evaluationId: input.evaluationId,
        description: input.description ?? "No description provided",
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        const client = await connectToDatabase();
        const db = client.db("evaluacionedificiositcr");
        const collection = db.collection("imagenes");
        
        const documentoEvaluacion = {
          name: file.name,
          url: file.url,
          description: metadata.description,
          evaluationId: metadata.evaluationId,
          userId: metadata.userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        const result = await collection.insertOne(documentoEvaluacion);

        if (!result.acknowledged) {
          throw new Error("Failed to insert document");
        }
        console.log("Document inserted successfully:", result.insertedId);

        return { success: true };
      } catch (error) {
        console.error("Failed to insert image:", error);
        throw new Error("Database insertion failed");
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
