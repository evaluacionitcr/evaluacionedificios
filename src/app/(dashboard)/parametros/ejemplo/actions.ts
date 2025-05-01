"use server";

import { db } from "~/server/db";
import { sql } from "drizzle-orm";
import { Componentes, EstadosConservacion, Funcionalidades, Normativas } from "~/server/db/schema";
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

export async function getFuncionalidades() {
    try {
      const funcionalidades = await db.select().from(Funcionalidades);
      return { success: true, data: funcionalidades };
    }
    catch (error) {
      console.error("Error al obtener las funcionalidades:", error);
      return { success: false, error: "No se pudieron cargar las funcionalidades" };
    }
  }

export async function getNormativas() {
    try {
      const normativas = await db.select().from(Normativas);
      return { success: true, data: normativas };
    }
    catch (error) {
      console.error("Error al obtener las funcionalidades:", error);
      return { success: false, error: "No se pudieron cargar las funcionalidades" };
    }
  }