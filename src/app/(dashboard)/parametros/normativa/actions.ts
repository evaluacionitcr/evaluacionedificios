"use server";

import { db } from "~/server/db";
import { sql } from "drizzle-orm";
import { Normativas } from "~/server/db/schema";
import { revalidatePath } from "next/cache";

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

export async function createNormativa(data: {
  estado: string;
  puntuacion: number;
  descripcion: string;
}) {
  try {
    const normativas = await db.insert(Normativas).values({
      Estado: data.estado,
      Puntuacion: data.puntuacion.toString(),
      Descripcion: data.descripcion
    }).returning();

    revalidatePath("/parametros/normativa");

    return { success: true, data: normativas };
  } catch (error) {
    console.error("Error al crear la funcionalidad:", error);
    return { success: false, error: "No se pudo crear la funcionalidad" };
  }
}

export async function updateNormativa(data: {
    id: number;
    estado: string;
    puntuacion: number;
    descripcion: string;
    }
) {
  try {
    const updatedNormativa = await db
      .update(Normativas)
      .set({
        ...data,
        Estado: data.estado,
        Puntuacion: data.puntuacion.toString(),
        Descripcion: data.descripcion
      })
      .where(sql`${Normativas.id} = ${data.id}`)
      .returning();

    revalidatePath("/parametros/normativa");

    return { success: true, data: updatedNormativa };
  } catch (error) {
    console.error("Error al actualizar la funcionalidad:", error);
    return { success: false, error: "No se pudo actualizar la funcionalidad" };
  }
}

export async function deleteNormativa(id: number) {
  try {
    const deletedNormativa = await db
      .delete(Normativas)
      .where(sql`${Normativas.id} = ${id}`)
      .returning();

    revalidatePath("/parametros/funcionalidad");

    return { success: true, data: deletedNormativa };
  } catch (error) {
    console.error("Error al eliminar la funcionalidad:", error);
    return { success: false, error: "No se pudo eliminar la funcionalidad" };
  }
}