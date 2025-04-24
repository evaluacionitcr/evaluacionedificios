"use server";

import { db } from "~/server/db";
import { sql } from "drizzle-orm";
import { Componentes } from "~/server/db/schema";
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

export async function createComponente(data: {
  componente: string;
  peso: number;
  elementos: string;
}) {
  try {
    const componente = await db.insert(Componentes).values(data).returning();

    revalidatePath("/parametros/componentes");

    return { success: true, data: componente };
  } catch (error) {
    console.error("Error al crear el componente:", error);
    return { success: false, error: "No se pudo crear el componente" };
  }
}

export async function updateComponente(data: {
    id: number;
    componente: string;
    peso: number;
    elementos: string;
    }
) {
  try {
    const updatedComponente = await db
      .update(Componentes)
      .set(data)
      .where(sql`${Componentes.id} = ${data.id}`)
      .returning();

    revalidatePath("/parametros/componentes");

    return { success: true, data: updatedComponente };
  } catch (error) {
    console.error("Error al actualizar el componente:", error);
    return { success: false, error: "No se pudo actualizar el componente" };
  }
}