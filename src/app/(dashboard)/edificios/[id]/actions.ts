"use server";

import { eliminarRegistroEdificio, getDetallesEdificio, eliminarEdificioCompleto } from "~/server/actions/edificios";
import { getDetallesAcera } from "~/server/actions/aceras";
import { getDetallesTerreno } from "~/server/actions/terreno";
import { getDetallesZonasVerdes } from "~/server/actions/zonasVerdes";

// Re-exportar la función para usarla en el componente de la página
export { eliminarRegistroEdificio, eliminarEdificioCompleto };

// Función para obtener los detalles del edificio
export async function obtenerDetallesEdificio(codigoEdificio: string) {
  try {
    const edificios = await getDetallesEdificio(codigoEdificio);
    return { success: true, data: edificios };
  } catch (error) {
    console.error("Error al obtener detalles del edificio:", error);
    return { success: false, error: "No se pudieron cargar los detalles del edificio" };
  }
}

export async function obtenerDetallesAceras(codigoEdificio: string) {
  try {
    const aceras = await getDetallesAcera(codigoEdificio);
    return { success: true, data: aceras };
  } catch (error) {
    console.error("Error al obtener detalles de la acera:", error);
    return { success: false, error: "No se pudieron cargar los detalles de la acera" };
  }
}

export async function obtenerDetallesTerreno(codigo_edificio: string) {
  try {
    const terrenos = await getDetallesTerreno(codigo_edificio);
    return { success: true, data: terrenos };
  } catch (error) {
    console.error("Error al obtener detalles del terreno:", error);
    return { success: false, error: "No se pudieron cargar los detalles del terreno" };
  }
}

export async function obtenerDetallesZonasVerdes(codigo_edificio: string) {
  try {
    const zonasVerdes = await getDetallesZonasVerdes(codigo_edificio);
    return { success: true, data: zonasVerdes };
  } catch (error) {
    console.error("Error al obtener detalles de las zonas verdes:", error);
    return { success: false, error: "No se pudieron cargar los detalles de las zonas verdes" };
  }
}