"use server";

import { db } from "~/server/db";
// Importa el schema de Sedes directamente aquí
import { Sedes } from "~/server/db/schema"; 
// import { Edificios } from "~/server/db/schema";

export async function fetchSedes() {
  try {
    // Accedemos directamente a la tabla de Sedes desde este archivo
    const sedes = await db.select().from(Sedes);
    return { success: true, data: sedes };
  } catch (error) {
    console.error("Error al obtener las sedes:", error);
    return { success: false, error: "No se pudieron cargar las sedes" };
  }
}

export async function createEdificio(data: {
  codigo: string;
  nombre: string;
  sedeId: number;
  anioConstruccion: number;
  metrosCuadrados: number;
  valorDolarM2: number;
  vidaUtilHacienda: number;
  vidaUtilExperto: number;
  fincaId?: number;
}) {
  try {
    // Aquí implementarás la lógica para guardar el edificio en la base de datos
    // Por ejemplo:
    /* 
    await db.insert(Edificios).values({
      codigo: data.codigo,
      nombre: data.nombre,
      sedeId: data.sedeId,
      anioConstruccion: data.anioConstruccion,
      metrosCuadrados: data.metrosCuadrados,
      valorDolarM2: data.valorDolarM2,
      vidaUtilHacienda: data.vidaUtilHacienda,
      vidaUtilExperto: data.vidaUtilExperto,
      fincaId: data.fincaId,
      valorInicial: data.metrosCuadrados * data.valorDolarM2,
    });
    */
    
    return { success: true, message: "Edificio creado correctamente" };
  } catch (error) {
    console.error("Error al crear el edificio:", error);
    return { success: false, error: "No se pudo crear el edificio" };
  }
}