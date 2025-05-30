import { db } from "~/server/db";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { Sedes } from "~/server/db/schema";

interface Sede {
  id: number;
  nombre: string;
}

export async function GET() {
  try {
    const sedes = await db
      .select({
        id: Sedes.id,
        nombre: Sedes.nombre,
      })
      .from(Sedes);

    if (!sedes.length) {
      return NextResponse.json(
        { error: "No se encontraron sedes" },
        { status: 404 },
      );
    }

    console.log("Datos de las sedes enviados:", sedes);
    return NextResponse.json(sedes);
  } catch (error) {
    console.error("Error al obtener los datos de las sedes:", error);
    return NextResponse.json(
      { error: "Error al obtener los datos de las sedes" },
      { status: 500 },
    );
  }
}