import { eq, sql, min, ilike } from "drizzle-orm";
import { db } from "~/server/db";
import { Construcciones, Sedes, NumeroFincas, UsosActuales } from "../db/schema";
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
  edad: number | null;
  vidaUtilHacienda: number | null;
  vidaUtilExperto: number | null;
  valorReposicion: string | null;
  depreciacionLinealAnual: string | null;
  valorActualRevaluado: string | null;
  anoDeRevaluacion: number | null;
  usoActual: string | null;
}
// edificios.ts
export async function getConstruccionesPorSede() {
  try {
    // Primero obtenemos los IDs mínimos para cada código de edificio
    const idsMinimos = await db
      .select({
        codigoEdificio: Construcciones.codigoEdificio,
        id: min(Construcciones.id),
      })
      .from(Construcciones)
      .where(eq(Construcciones.activo, true))
      .groupBy(Construcciones.codigoEdificio);

    // Luego obtenemos los edificios con información de sede solo para esos IDs
    const edificiosConSede = await db
      .select({
        id: Construcciones.id,
        codigoEdificio: Construcciones.codigoEdificio,
        nombre: Construcciones.nombre,
        sedeId: Sedes.id,
        sedeNombre: Sedes.nombre,
      })
      .from(Construcciones)
      .leftJoin(Sedes, eq(Construcciones.sede, Sedes.id))
      .where(sql`${Construcciones.id} IN ${idsMinimos.map((e) => e.id)}`)
      .orderBy(Sedes.nombre, Construcciones.codigoEdificio);

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
    console.error("Error obteniendo Construcciones por campus/centro académico:", error);
    return []; // Devuelve un array vacío en caso de error
  }
}

export async function getDetallesEdificio(
  codigoEdificio: string,
): Promise<DetallesEdificio[]> {
  try {
    if (!codigoEdificio?.trim()) {
      throw new Error("El código del edificio es requerido");
    }

    console.log("Buscando edificio con código:", codigoEdificio);

    // Primero, obtenemos los IDs más recientes para este código de edificio
    const idsRecientes = await db
      .select({
        id: Construcciones.id,
      })
      .from(Construcciones)
      .where(ilike(Construcciones.codigoEdificio, codigoEdificio))
      .orderBy(sql`${Construcciones.id} DESC`)
      .limit(1);


    if (idsRecientes.length === 0) {
      console.log("No se encontraron registros para el código:", codigoEdificio);
      return [];
    }

    const edificios = await db
      .select({
        id: Construcciones.id,
        codigoEdificio: Construcciones.codigoEdificio,
        sede: Construcciones.sede,
        sedeNombre: Sedes.nombre,
        esRenovacion: Construcciones.esRenovacion,
        nombre: Construcciones.nombre,
        fechaConstruccion: Construcciones.fechaConstruccion,
        noFinca: Construcciones.noFinca,
        numeroFinca: NumeroFincas.numero,
        m2Construccion: Construcciones.m2Construccion,
        valorDolarPorM2: Construcciones.valorDolarPorM2,
        valorColonPorM2: Construcciones.valorColonPorM2,
        edad: Construcciones.edad,
        vidaUtilHacienda: Construcciones.vidaUtilHacienda,
        vidaUtilExperto: Construcciones.vidaUtilExperto,
        valorReposicion: Construcciones.valorReposicion,
        depreciacionLinealAnual: Construcciones.depreciacionLinealAnual,
        valorActualRevaluado: Construcciones.valorActualRevaluado,
        anoDeRevaluacion: Construcciones.anoDeRevaluacion,
        usoActual: UsosActuales.descripcion,
      })
      .from(Construcciones)
      .leftJoin(Sedes, eq(Construcciones.sede, Sedes.id))
      .leftJoin(NumeroFincas, eq(Construcciones.noFinca, NumeroFincas.id))
      .leftJoin(UsosActuales, eq(Construcciones.usoActual, UsosActuales.id))
      .where(eq(Construcciones.id, idsRecientes[0]?.id ?? 0));

    console.log("Resultados encontrados:", edificios.length);
    console.log("Datos del edificio:", edificios[0]);
    return edificios;
  } catch (error) {
    console.error("Error obteniendo detalles del edificio:", error);
    throw error;
  }
}

// Nueva función para eliminar un registro de edificio
export async function eliminarRegistroEdificio(id: number) {
  try {
    const resultado = await db
      .update(Construcciones)
      .set({ activo: false })
      .where(eq(Construcciones.id, id))
      .returning({ id: Construcciones.id });
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
      .update(Construcciones)
      .set({ activo: false })
      .where(ilike(Construcciones.codigoEdificio, codigoEdificio))
      .returning({ id: Construcciones.id });
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
