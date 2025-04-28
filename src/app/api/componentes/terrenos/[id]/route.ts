import { db } from "~/server/db";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { Terrenos } from "~/server/db/schema";

export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop(); // extraemos el id de la URL

    if (!id) {
      return NextResponse.json(
        { error: "No se proporcionó id" },
        { status: 400 }
      );
    }

    const data = await request.json();
    const result = await db
      .update(Terrenos)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(Terrenos.id, parseInt(id)))
      .returning();

    if (!result.length) {
      return NextResponse.json(
        { error: "No se encontró el terreno" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, error: "Error al actualizar el terreno" },
      { status: 500 }
    );
  }
}
