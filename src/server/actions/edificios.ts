import { eq, sql, min, ilike } from "drizzle-orm";
import { db } from "~/server/db";
import { Edificaciones, Sedes, NumeroFincas, UsosActuales } from "../db/schema";
import { revalidatePath } from "next/cache";

interface Edificio {
  id: number;
  nombre: string;
  codigo: string;
}

interface Sede {
  id: number;
  nombre: string;
  edificios: Edificio[];
}

interface DetallesEdificio {
  id: number;
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
  edadAl2021: number | null;
  vidaUtilHacienda: number | null;
  vidaUtilExperto: number | null;
  valorEdificioIR: string | null;
  depreciacionLinealAnual: string | null;
  valorActualRevaluado: string | null;
  anoDeRevaluacion: number | null;
  usoActual: string | null;
}
// edificios.ts
export async function getEdificacionesPorSede() {
  try {
    // Primero obtenemos los IDs mínimos para cada código de edificio
    const idsMinimos = await db
      .select({
        codigoEdificio: Edificaciones.codigoEdificio,
        id: min(Edificaciones.id),
      })
      .from(Edificaciones)
      .groupBy(Edificaciones.codigoEdificio);

    // Luego obtenemos los edificios con información de sede solo para esos IDs
    const edificiosConSede = await db
      .select({
        id: Edificaciones.id,
        codigoEdificio: Edificaciones.codigoEdificio,
        nombre: Edificaciones.nombre,
        sedeId: Sedes.id,
        sedeNombre: Sedes.nombre,
      })
      .from(Edificaciones)
      .leftJoin(Sedes, eq(Edificaciones.sede, Sedes.id))
      .where(sql`${Edificaciones.id} IN ${idsMinimos.map((e) => e.id)}`)
      .orderBy(Sedes.nombre, Edificaciones.codigoEdificio);

    // Usamos un mapa para agrupar por sede
    const edificiosPorSede = new Map<number, Sede>();

    for (const edificio of edificiosConSede) {
      // Creamos la entrada para la sede si no existe
      const sedeId = edificio.sedeId ?? 0; // 0 para edificios sin sede asignada
      const sedeNombre = edificio.sedeNombre ?? "Sin sede asignada";

      if (!edificiosPorSede.has(sedeId)) {
        edificiosPorSede.set(sedeId, {
          id: sedeId,
          nombre: sedeNombre,
          edificios: [],
        });
      }

      const sede = edificiosPorSede.get(sedeId);
      if (sede) {
        sede.edificios.push({
          id: edificio.id,
          nombre: edificio.nombre,
          codigo: edificio.codigoEdificio,
        });
      }
    }

    // Convertimos el mapa a array, ordenamos las sedes por nombre y los edificios por código
    return Array.from(edificiosPorSede.values())
      .map((sede: Sede) => ({
        ...sede,
        edificios: sede.edificios.sort((a: Edificio, b: Edificio) =>
          a.codigo.localeCompare(b.codigo),
        ),
      }))
      .sort((a: Sede, b: Sede) => a.nombre.localeCompare(b.nombre));
  } catch (error) {
    console.error("Error obteniendo edificaciones por sede:", error);
    return []; // Devuelve un array vacío en caso de error
  }
}

export async function getDetallesEdificio(
  codigoEdificio: string,
): Promise<DetallesEdificio[]> {
  try {
    if (!codigoEdificio) {
      console.log("codigoEdificio es nulo o vacío");
      return [];
    }

    console.log("Buscando edificio con código:", codigoEdificio);

    const edificios = await db
      .select({
        id: Edificaciones.id,
        codigoEdificio: Edificaciones.codigoEdificio,
        sede: Edificaciones.sede,
        sedeNombre: Sedes.nombre,
        esRenovacion: Edificaciones.esRenovacion,
        nombre: Edificaciones.nombre,
        fechaConstruccion: Edificaciones.fechaConstruccion,
        numeroFinca: NumeroFincas.numero,
        m2Construccion: Edificaciones.m2Construccion,
        valorDolarPorM2: Edificaciones.valorDolarPorM2,
        valorColonPorM2: Edificaciones.valorColonPorM2,
        edadAl2021: Edificaciones.edadAl2021,
        vidaUtilHacienda: Edificaciones.vidaUtilHacienda,
        vidaUtilExperto: Edificaciones.vidaUtilExperto,
        valorEdificioIR: Edificaciones.valorEdificioIR,
        depreciacionLinealAnual: Edificaciones.depreciacionLinealAnual,
        valorActualRevaluado: Edificaciones.valorActualRevaluado,
        anoDeRevaluacion: Edificaciones.anoDeRevaluacion,
        usoActual: UsosActuales.descripcion,
      })
      .from(Edificaciones)
      .leftJoin(Sedes, eq(Edificaciones.sede, Sedes.id))
      .leftJoin(NumeroFincas, eq(Edificaciones.noFinca, NumeroFincas.id))
      .leftJoin(UsosActuales, eq(Edificaciones.usoActual, UsosActuales.id))
      .where(ilike(Edificaciones.codigoEdificio, codigoEdificio))
      .orderBy(Edificaciones.id);

    console.log("Resultados encontrados:", edificios.length);
    return edificios;
  } catch (error) {
    console.error("Error obteniendo detalles del edificio:", error);
    return [];
  }
}

// Nueva función para eliminar un registro de edificio
export async function eliminarRegistroEdificio(id: number) {
  try {
    const resultado = await db
      .delete(Edificaciones)
      .where(eq(Edificaciones.id, id))
      .returning({ id: Edificaciones.id });
    // Añadir esta línea para revalidar la página de edificios
      revalidatePath("/edificios");

    return {
      success: true,
      mensaje: "Registro eliminado exitosamente",
      eliminado: resultado.length > 0,
    };
  } catch (error) {
    console.error("Error al eliminar el registro del edificio:", error);
    return { 
      success: false, 
      error: "No se pudo eliminar el registro del edificio."
    };
  }
}

// Nueva función para eliminar todos los registros de un edificio por su código
export async function eliminarEdificioCompleto(codigoEdificio: string) {
  try {
    const resultado = await db
      .delete(Edificaciones)
      .where(ilike(Edificaciones.codigoEdificio, codigoEdificio))
      .returning({ id: Edificaciones.id });
    // Añadir esta línea para revalidar la página de edificios
      revalidatePath("/edificios");

    return {
      success: true,
      mensaje: "Edificio eliminado exitosamente",
      eliminados: resultado.length,
      ids: resultado.map((r) => r.id),
    };
  } catch (error) {
    console.error("Error al eliminar el edificio:", error);
    return { 
      success: false, 
      error: "No se pudo eliminar el edificio."
    };
  }
}
