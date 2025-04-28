import { db } from "~/server/db";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { Aceras } from "~/server/db/schema";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return NextResponse.json(
        { error: "No se proporcionó id" },
        { status: 400 }
      );
    }

    const data = await request.json();
    const result = await db
      .update(Aceras)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(Aceras.id, parseInt(params.id)))
      .returning();

    if (!result.length) {
      return NextResponse.json(
        { error: "No se encontró la acera" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, error: "Error al actualizar la acera" },
      { status: 500 }
    );
  }
}
