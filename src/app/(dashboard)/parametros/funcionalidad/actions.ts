"use server";

import { db } from "~/server/db";
import { sql } from "drizzle-orm";
import { Funcionalidades } from "~/server/db/schema";
import { revalidatePath } from "next/cache";

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

export async function createFuncionalidad(data: {
  estado: string;
  puntuacion: number;
  descripcion: string;
}) {
  try {
    const funcionalidades = await db.insert(Funcionalidades).values({
      Estado: data.estado,
      Puntuacion: data.puntuacion.toString(),
      Descripcion: data.descripcion
    }).returning();

    revalidatePath("/parametros/funcionalidad");

    return { success: true, data: funcionalidades };
  } catch (error) {
    console.error("Error al crear la funcionalidad:", error);
    return { success: false, error: "No se pudo crear la funcionalidad" };
  }
}

export async function updateFuncionalidad(data: {
    id: number;
    estado: string;
    puntuacion: number;
    descripcion: string;
    }
) {
  try {
    const updatedFuncionalidad = await db
      .update(Funcionalidades)
      .set({
        ...data,
        Estado: data.estado,
        Puntuacion: data.puntuacion.toString(),
        Descripcion: data.descripcion
      })
      .where(sql`${Funcionalidades.id} = ${data.id}`)
      .returning();

    revalidatePath("/parametros/funcionalidad");

    return { success: true, data: updatedFuncionalidad };
  } catch (error) {
    console.error("Error al actualizar la funcionalidad:", error);
    return { success: false, error: "No se pudo actualizar la funcionalidad" };
  }
}

export async function deleteFuncionalidad(id: number) {
  try {
    const deletedFuncionalidad = await db
      .delete(Funcionalidades)
      .where(sql`${Funcionalidades.id} = ${id}`)
      .returning();

    revalidatePath("/parametros/funcionalidad");

    return { success: true, data: deletedFuncionalidad };
  } catch (error) {
    console.error("Error al eliminar la funcionalidad:", error);
    return { success: false, error: "No se pudo eliminar la funcionalidad" };
  }
}