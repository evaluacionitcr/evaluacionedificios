import { db } from "~/server/db";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { Terrenos } from "~/server/db/schema";

interface TerrenosUpdateData {
  idConstruccion?: number | null;
  codigoEdificio: string;
  nombre: string;
  fechaConstruccion?: number | null;
  m2Construccion: number;
  valorDolarPorM2: string;
  valorColonPorM2: string;
  noFinca?: number | null;
  usoActual?: number | null;
  valorPorcionTerreno?: string;
  anoDeRevaluacion?: number;
}

function isValidTerrenosData(data: unknown): data is TerrenosUpdateData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'codigoEdificio' in data &&
    'nombre' in data &&
    'm2Construccion' in data &&
    'valorDolarPorM2' in data &&
    'valorColonPorM2' in data
  );
}

export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json(
        { error: "No se proporcionó id" },
        { status: 400 }
      );
    }

    const body = await request.json();
    if (!isValidTerrenosData(body)) {
      return NextResponse.json(
        { error: "Datos de terreno inválidos" },
        { status: 400 }
      );
    }

    const result = await db
      .update(Terrenos)
      .set({
        ...(body as Omit<TerrenosUpdateData, 'updatedAt'>),
        updatedAt: new Date(),
      } satisfies Partial<typeof Terrenos.$inferInsert>)
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
