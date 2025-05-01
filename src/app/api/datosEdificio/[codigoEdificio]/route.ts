import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { Construcciones, UsosActuales, NumeroFincas, Sedes } from "~/server/db/schema";
import { eq, ilike } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ codigoEdificio: string }> },
) {
  try {
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
        nombre: Construcciones.nombre,
        sedeNombre: Sedes.nombre,
        fechaConstruccion: Construcciones.fechaConstruccion,
        m2Construccion: Construcciones.m2Construccion,
        usoActualDescripcion: UsosActuales.descripcion,
        noFinca: NumeroFincas.numero,
        valorDolarPorM2: Construcciones.valorDolarPorM2,
        valorColonPorM2: Construcciones.valorColonPorM2,
        edad: Construcciones.edad,
        vidaUtilHacienda: Construcciones.vidaUtilHacienda,
        vidaUtilExperto: Construcciones.vidaUtilExperto,
        valorReposicion: Construcciones.valorReposicion,
        depreciacionLinealAnual: Construcciones.depreciacionLinealAnual,
        valorActualRevaluado: Construcciones.valorActualRevaluado,
        anoDeRevaluacion: Construcciones.anoDeRevaluacion
      })
      .from(Construcciones)
      .leftJoin(UsosActuales, eq(Construcciones.usoActual, UsosActuales.id))
      .leftJoin(NumeroFincas, eq(Construcciones.noFinca, NumeroFincas.id))
      .leftJoin(Sedes, eq(Construcciones.sede, Sedes.id))
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
    console.error("Error al obtener los datos del edificio:", error);
    return NextResponse.json(
      { error: "Error al obtener los datos del edificio" },
      { status: 500 },
    );
  }
}
