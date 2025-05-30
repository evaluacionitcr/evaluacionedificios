"use server";

import { db } from "~/server/db";
import { sql } from "drizzle-orm";
import { EjesPriorizacion } from "~/server/db/schema";
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

export async function createEje(data: { eje: string; peso: number }) {
  try {
    const resultado = await db.insert(EjesPriorizacion).values({
      eje: data.eje,
      peso: data.peso.toString(),
    }).returning();
    
    revalidatePath("/parametros");
    return { success: true, data: resultado[0] };
  } catch (error) {
    console.error("Error al crear eje:", error);
    return { success: false, error: "No se pudo crear el eje" };
  }
}

export async function updateEje(data: { id: number; eje: string; peso: number }) {
  try {
    const resultado = await db.update(EjesPriorizacion)
      .set({ 
        eje: data.eje, 
        peso: data.peso.toString(),
        updatedAt: new Date()
      })
      .where(sql`id = ${data.id}`)
      .returning();
    
    revalidatePath("/parametros");
    return { success: true, data: resultado[0] };
  } catch (error) {
    console.error("Error al actualizar eje:", error);
    return { success: false, error: "No se pudo actualizar el eje" };
  }
}

export async function deleteEje(id: number) {
  try {
    await db.delete(EjesPriorizacion)
      .where(sql`id = ${id}`);
    
    revalidatePath("/parametros");
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar eje:", error);
    return { success: false, error: "No se pudo eliminar el eje" };
  }
}