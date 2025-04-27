import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { Construcciones, NumeroFincas } from "~/server/db/schema";
import { eq, ilike } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: { codigoEdificio: string } },
) {
  try {
    // Await the params object before accessing properties
    const paramsData = await params;
    const { codigoEdificio } = paramsData;

    if (!codigoEdificio) {
      return NextResponse.json(
        { error: "Código de edificio no proporcionado" },
        { status: 400 },
      );
    }

    const resultado = await db
      .select({
        id: Construcciones.id,
        codigoEdificio: Construcciones.codigoEdificio,
        noFinca: NumeroFincas.numero,
      })
      .from(Construcciones)
      .leftJoin(NumeroFincas, eq(Construcciones.noFinca, NumeroFincas.id))
      .where(ilike(Construcciones.codigoEdificio, codigoEdificio))
      .limit(1);

    if (!resultado.length) {
      return NextResponse.json(
        { error: "Edificio no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(resultado[0]);
  } catch (error) {
    console.error("Error al obtener el numero de finca:", error);
    return NextResponse.json(
      { error: "Error al obtener el numero de finca" },
      { status: 500 },
    );
  }
}
