import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { Construcciones, UsosActuales, NumeroFincas } from "~/server/db/schema";
import { eq, ilike } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ codigoEdificio: string }> },
) {
  try {
    // Await the params object before accessing properties
    
    const { codigoEdificio } = await params;

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
        usoActualId: Construcciones.usoActual,
        usoActualDescripcion: UsosActuales.descripcion,
        noFinca: NumeroFincas.numero,
        fechaConstruccion: Construcciones.fechaConstruccion,
      })
      .from(Construcciones)
      .leftJoin(UsosActuales, eq(Construcciones.usoActual, UsosActuales.id))
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
    console.error("Error al obtener el uso actual:", error);
    return NextResponse.json(
      { error: "Error al obtener el uso actual" },
      { status: 500 },
    );
  }
}
