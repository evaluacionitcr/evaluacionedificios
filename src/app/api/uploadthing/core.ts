import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { images } from "~/server/db/schema";
import { z } from "zod";

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
        evaluationId: z.number().optional(),
        description: z.string().optional(),
      }),
    )
    .middleware(async ({ input }) => {
      const user = await auth();

      if (!user.userId) {
        throw new UploadThingError("Unauthorized");
      }

      return {
        userId: user.userId,
        evaluationId: input.evaluationId,
        description: input.description ?? "No description provided",
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        await db.insert(images).values({
          name: file.name,
          url: file.url,
          description: metadata.description,
          evaluationId: metadata.evaluationId,
          userId: metadata.userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        console.log(`Successfully inserted image: ${file.name}`);
        return { success: true };
      } catch (error) {
        console.error("Failed to insert image:", error);
        throw new UploadThingError("Database insertion failed");
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
