"use server";

import { db } from "~/server/db";
import { sql } from "drizzle-orm";
import { CriteriosPriorizacion, ParametrosPriorizacion, EjesPriorizacion } from "~/server/db/schema";
import { revalidatePath } from "next/cache";

export async function getEjes() {
    try {
        const ejes = await db.select().from(EjesPriorizacion);
        return { success: true, data: ejes };
    }
    catch (error) {
        console.error("Error al obtener los ejes:", error);
        return { success: false, error: "No se pudieron cargar los ejes" };
    }
}

export async function getCriterios() {
    try {
        const criterios = await db.select().from(CriteriosPriorizacion);
        return { success: true, data: criterios };
    }
    catch (error) {
        console.error("Error al obtener los criterios:", error);
        return { success: false, error: "No se pudieron cargar los criterios" };
    }
}

export async function getParametros() {
    try {
        const parametros = await db.select().from(ParametrosPriorizacion);
        return { success: true, data: parametros };
    }
    catch (error) {
        console.error("Error al obtener los parametros:", error);
        return { success: false, error: "No se pudieron cargar los parametros" };
    }
}


