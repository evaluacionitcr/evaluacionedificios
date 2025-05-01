"use server";

import { db } from "~/server/db";
import { sql } from "drizzle-orm";
import { Componentes, EstadosConservacion } from "~/server/db/schema";
import { revalidatePath } from "next/cache";

export async function getComponentes() {
  try {
    const componentes = await db.select().from(Componentes);
    return { success: true, data: componentes };
  }
  catch (error) {
    console.error("Error al obtener los componentes:", error);
    return { success: false, error: "No se pudieron cargar los componentes" };
  }
}

export async function getEstadoConservacion() {
    try {
        const estadoConservacion = await db.select().from(EstadosConservacion);
        return { success: true, data: estadoConservacion };
    } catch (error) {
        console.error("Error al obtener el estado de conservación:", error);
        return { success: false, error: "No se pudo cargar el estado de conservación" };
    }
}