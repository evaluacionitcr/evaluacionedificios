import { eq, sql, min, ilike } from "drizzle-orm";
import { db } from "~/server/db";
import {Terrenos, Sedes, NumeroFincas, UsosActuales, Construcciones } from "../db/schema";
import { revalidatePath } from "next/cache";


interface DetallesTerreno {
    id: number;
    idConstruccion: number | null;
    codigoEdificio: string;
    sede: number | null;
    sedeNombre: string | null;
    esRenovacion: boolean | null;
    nombre: string;
    fechaConstruccion: number | null;
    numeroFinca: string | null;
    m2Construccion: number | null;
    valorDolarPorM2: string | null;
    valorColonPorM2: string | null;
    edad: number | null;
    vidaUtilHacienda: number | null;
    vidaUtilExperto: number | null;
    valorReposicion: string | null;
    depreciacionLinealAnual: string | null;
    valorActualRevaluado: string | null;
    anoDeRevaluacion: number | null;
    usoActual: string | null;
}

export async function getDetallesTerreno(
  codigoEdificio: string,
): Promise<DetallesTerreno[]> {
  try {
    if (!codigoEdificio) {
      console.log("codigoEdificio es nulo o vacío");
      return [];
    }

    console.log("Buscando edificio con código:", codigoEdificio);

    const terrenos = await db
      .select({
        id: Terrenos.id,
        idConstruccion: Terrenos.idConstruccion,
        codigoEdificio: Terrenos.codigoEdificio,
        sede: Construcciones.sede,
        sedeNombre: Sedes.nombre,
        esRenovacion: Construcciones.esRenovacion,
        nombre: Terrenos.nombre,
        fechaConstruccion: Terrenos.fechaConstruccion,
        numeroFinca: NumeroFincas.numero,
        m2Construccion: Terrenos.m2Construccion,
        valorDolarPorM2: Terrenos.valorDolarPorM2,
        valorColonPorM2: Terrenos.valorColonPorM2,
        edad: Construcciones.edad,
        anoDeRevaluacion: Terrenos.anoDeRevaluacion,
        usoActual: UsosActuales.descripcion,
      })
      .from(Terrenos)
      .leftJoin(Construcciones, eq(Terrenos.idConstruccion, Construcciones.id))
      .leftJoin(Sedes, eq(Construcciones.sede, Sedes.id))
      .leftJoin(NumeroFincas, eq(Terrenos.noFinca, NumeroFincas.id))
      .leftJoin(UsosActuales, eq(Construcciones.usoActual, UsosActuales.id))
      .where(ilike(Construcciones.codigoEdificio, codigoEdificio))
      .orderBy(Terrenos.id);

    console.log("Resultados encontrados:", terrenos.length);
    return terrenos;
  } catch (error) {
    console.error("Error obteniendo detalles del edificio:", error);
    return [];
  }
}