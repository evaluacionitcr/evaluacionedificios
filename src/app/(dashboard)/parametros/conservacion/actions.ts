"use server";

import { db } from "~/server/db";
import { sql } from "drizzle-orm";
import { EstadosConservacion } from "~/server/db/schema";
import { revalidatePath } from "next/cache";

export async function getEstadoConservacion() {
    try {
        const estadoConservacion = await db.select().from(EstadosConservacion);
        return { success: true, data: estadoConservacion };
    } catch (error) {
        console.error("Error al obtener el estado de conservación:", error);
        return { success: false, error: "No se pudo cargar el estado de conservación" };
    }
}

export async function createEstadoConservacion(data: {
    estado_conservacion: string;
    condiciones_fisicas: string;
    clasificacion: string;
    coef_depreciacion: number;
}) {
    try {
        const estadoConservacion = await db.insert(EstadosConservacion).values({
            ...data,
            coef_depreciacion: data.coef_depreciacion.toString()
        }).returning();

        revalidatePath("/parametros/conservacion");

        return { success: true, data: estadoConservacion };
    } catch (error) {
        console.error("Error al crear el estado de conservación:", error);
        return { success: false, error: "No se pudo crear el estado de conservación" };
    }
}

export async function updateEstadoConservacion(data: {
    id: number;
    estado_conservacion: string;
    condiciones_fisicas: string;
    clasificacion: string;
    coef_depreciacion: number;
}) {
    try {
        const updatedEstadoConservacion = await db
            .update(EstadosConservacion)
            .set({
                ...data,
                coef_depreciacion: data.coef_depreciacion.toString()
            })
            .where(sql`${EstadosConservacion.id} = ${data.id}`)
            .returning();

        revalidatePath("/parametros/conservacion");

        return { success: true, data: updatedEstadoConservacion };
    } catch (error) {
        console.error("Error al actualizar el estado de conservación:", error);
        return { success: false, error: "No se pudo actualizar el estado de conservación" };
    }
}

export async function deleteEstadoConservacion(id: number) {
    try {
        const deletedEstadoConservacion = await db
            .delete(EstadosConservacion)
            .where(sql`${EstadosConservacion.id} = ${id}`)
            .returning();

        revalidatePath("/parametros/conservacion");

        return { success: true, data: deletedEstadoConservacion };
    } catch (error) {
        console.error("Error al eliminar el estado de conservación:", error);
        return { success: false, error: "No se pudo eliminar el estado de conservación" };
    }
}