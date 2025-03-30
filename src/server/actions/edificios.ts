import { eq, sql, min } from "drizzle-orm";
import { db } from "~/server/db"; // Ajusta esta ruta a tu configuración
import { Edificaciones, Sedes } from "../db/schema"; // Ajusta esta ruta a tu esquema

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
