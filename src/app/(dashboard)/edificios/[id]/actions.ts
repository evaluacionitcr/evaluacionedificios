"use server";

import { eliminarRegistroEdificio, getDetallesEdificio, eliminarEdificioCompleto } from "~/server/actions/edificios";

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