import { eq, sql, min, ilike } from "drizzle-orm";
import { db } from "~/server/db";
import {ZonasVerdes, Sedes, NumeroFincas, UsosActuales, Construcciones } from "../db/schema";



interface DetallesZonasVerde {
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

export async function getDetallesZonasVerdes(
  codigoEdificio: string,
): Promise<DetallesZonasVerde[]> {
  try {
    if (!codigoEdificio) {
      console.log("codigoEdificio es nulo o vacío");
      return [];
    }

    console.log("Buscando edificio con código:", codigoEdificio);

    const zonasVerdes = await db
      .select({
        id: ZonasVerdes.id,
        idConstruccion: ZonasVerdes.idConstruccion,
        codigoEdificio: ZonasVerdes.codigoEdificio,
        sede: Construcciones.sede,
        sedeNombre: Sedes.nombre,
        esRenovacion: Construcciones.esRenovacion,
        nombre: ZonasVerdes.nombre,
        fechaConstruccion: ZonasVerdes.fechaConstruccion,
        numeroFinca: NumeroFincas.numero,
        m2Construccion: ZonasVerdes.m2Construccion,
        valorDolarPorM2: ZonasVerdes.valorDolarPorM2,
        valorColonPorM2: ZonasVerdes.valorColonPorM2,
        edad: Construcciones.edad,
        vidaUtilHacienda: ZonasVerdes.vidaUtilHacienda,
        vidaUtilExperto: ZonasVerdes.vidaUtilExperto,
        valorReposicion: ZonasVerdes.valorReposicion,
        depreciacionLinealAnual: ZonasVerdes.depreciacionLinealAnual,
        valorActualRevaluado: ZonasVerdes.valorActualRevaluado,
        anoDeRevaluacion: ZonasVerdes.anoDeRevaluacion,
        usoActual: UsosActuales.descripcion,
      })
      .from(ZonasVerdes)
      .leftJoin(Construcciones, eq(ZonasVerdes.idConstruccion, Construcciones.id))
      .leftJoin(Sedes, eq(Construcciones.sede, Sedes.id))
      .leftJoin(NumeroFincas, eq(ZonasVerdes.noFinca, NumeroFincas.id))
      .leftJoin(UsosActuales, eq(Construcciones.usoActual, UsosActuales.id))
      .where(ilike(Construcciones.codigoEdificio, codigoEdificio))
      .orderBy(ZonasVerdes.id);

    console.log("Resultados encontrados:", zonasVerdes.length);
    return zonasVerdes;
  } catch (error) {
    console.error("Error obteniendo detalles del edificio:", error);
    return [];
  }
}