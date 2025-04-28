import { db } from "~/server/db";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { ZonasVerdes } from "~/server/db/schema";

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const result = await db
      .update(ZonasVerdes)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(ZonasVerdes.id, parseInt(context.params.id)))
      .returning();

    if (!result.length) {
      return NextResponse.json(
        { error: "No se encontró la zona verde" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, error: "Error al actualizar la zona verde" },
      { status: 500 }
    );
  }
}
