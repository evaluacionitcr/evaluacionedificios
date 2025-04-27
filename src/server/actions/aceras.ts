import { eq, sql, min, ilike } from "drizzle-orm";
import { db } from "~/server/db";
import {Aceras, Sedes, NumeroFincas, UsosActuales, Construcciones } from "../db/schema";


interface DetallesAceras {
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

export async function getDetallesAcera(
  codigoEdificio: string,
): Promise<DetallesAceras[]> {
  try {
    if (!codigoEdificio) {
      console.log("codigoEdificio es nulo o vacío");
      return [];
    }

    console.log("Buscando edificio con código:", codigoEdificio);

    const aceras = await db
      .select({
        id: Aceras.id,
        idConstruccion: Aceras.idConstruccion,
        codigoEdificio: Aceras.codigoEdificio,
        sede: Construcciones.sede,
        sedeNombre: Sedes.nombre,
        esRenovacion: Construcciones.esRenovacion,
        nombre: Aceras.nombre,
        fechaConstruccion: Aceras.fechaConstruccion,
        numeroFinca: NumeroFincas.numero,
        m2Construccion: Aceras.m2Construccion,
        valorDolarPorM2: Aceras.valorDolarPorM2,
        valorColonPorM2: Aceras.valorColonPorM2,
        edad: Construcciones.edad,
        vidaUtilHacienda: Aceras.vidaUtilHacienda,
        vidaUtilExperto: Aceras.vidaUtilExperto,
        valorReposicion: Aceras.valorReposicion,
        depreciacionLinealAnual: Aceras.depreciacionLinealAnual,
        valorActualRevaluado: Aceras.valorActualRevaluado,
        anoDeRevaluacion: Aceras.anoDeRevaluacion,
        usoActual: UsosActuales.descripcion,
      })
      .from(Aceras)
      .leftJoin(Construcciones, eq(Aceras.idConstruccion, Construcciones.id))
      .leftJoin(Sedes, eq(Construcciones.sede, Sedes.id))
      .leftJoin(NumeroFincas, eq(Aceras.noFinca, NumeroFincas.id))
      .leftJoin(UsosActuales, eq(Construcciones.usoActual, UsosActuales.id))
      .where(ilike(Construcciones.codigoEdificio, codigoEdificio))
      .orderBy(Aceras.id);

    console.log("Resultados encontrados:", aceras.length);
    return aceras;
  } catch (error) {
    console.error("Error obteniendo detalles del edificio:", error);
    return [];
  }
}