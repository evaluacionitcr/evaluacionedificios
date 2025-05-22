import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { Construcciones, UsosActuales, NumeroFincas, Sedes } from "~/server/db/schema";
import { eq, ilike } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string}> },
) {
  try {
    const { id } = await params;

    if (!id) {

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
        usoActualId: Construcciones.usoActual, // Añadido: ID del uso actual
        noFinca: NumeroFincas.numero,
        noFincaId: Construcciones.noFinca, // Añadido: ID de la finca
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
      .where(eq(Construcciones.id, parseInt(id)))
      .limit(1);

    if (!resultado.length) {
      return NextResponse.json(
        { error: "Edificio no encontrado" },
        { status: 404 },
      );
    }

    console.log("Datos del edificio enviados:", resultado[0]);
    return NextResponse.json(resultado[0]);
  } catch (error) {
    console.error("Error al obtener los datos del edificio:", error);
    return NextResponse.json(
      { error: "Error al obtener los datos del edificio" },
      { status: 500 },
    );
  }
}
