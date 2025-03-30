"use server";

import { getSedes } from "~/server/actions/sedes";
import { db } from "~/server/db";
// Importar el schema necesario (suponiendo que existe)
// import { Edificios } from "~/server/db/schema";

export async function fetchSedes() {
  try {
    const sedes = await getSedes();
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