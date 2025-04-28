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