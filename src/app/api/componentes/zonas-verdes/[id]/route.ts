import { db } from "~/server/db";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { ZonasVerdes } from "~/server/db/schema";

interface ZonasVerdesUpdateData {
  idConstruccion?: number | null;
  codigoEdificio: string;
  nombre: string;
  fechaConstruccion?: number | null;
  m2Construccion: number;
  valorDolarPorM2: string;
  valorColonPorM2: string;
  edad?: number | null;
  vidaUtilHacienda: number;
  vidaUtilExperto: number;
  valorReposicion?: string;
  depreciacionLinealAnual?: string;
  valorActualRevaluado?: string;
  anoDeRevaluacion?: number;
  noFinca?: number | null;
  usoActual?: number | null;
}

function isValidZonasVerdesData(data: unknown): data is ZonasVerdesUpdateData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'codigoEdificio' in data &&
    'nombre' in data &&
    'm2Construccion' in data &&
    'valorDolarPorM2' in data &&
    'valorColonPorM2' in data &&
    'vidaUtilHacienda' in data &&
    'vidaUtilExperto' in data
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
    if (!isValidZonasVerdesData(body)) {
      return NextResponse.json(
        { error: "Datos de zona verde inválidos" },
        { status: 400 }
      );
    }

    const result = await db
      .update(ZonasVerdes)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(ZonasVerdes.id, parseInt(id)))
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
