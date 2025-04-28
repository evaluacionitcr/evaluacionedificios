"use server";
import { db } from "~/server/db";
import { Aceras, ZonasVerdes, Terrenos } from "../db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export interface ComponentData {
  idConstruccion?: number | null;
  codigoEdificio: string;
  nombre: string;
  fechaConstruccion?: number | null;
  m2Construccion: number;
  valorDolarPorM2: string | number;
  valorColonPorM2?: string | number;
  edad?: number;
  vidaUtilHacienda: number;
  vidaUtilExperto: number;
  valorReposicion?: number;
  depreciacionLinealAnual?: number;
  valorActualRevaluado?: number;
  anoDeRevaluacion?: number;
  noFinca?: number | null;
  usoActual?: number | null;
  valorPorcionTerreno?: number;
}

// Función auxiliar para verificar componente existente
async function checkExistingComponent(codigoEdificio: string, table: any) {
  return await db
    .select()
    .from(table)
    .where(eq(table.codigoEdificio, codigoEdificio))
    .execute();
}

export async function createAceras(data: any) {
  try {
    // Verificar si ya existe una acera para este edificio
    const existing = await checkExistingComponent(data.codigoEdificio, Aceras);
    
    if (existing.length > 0) {
      // Si existe, actualizar en lugar de crear
      const result = await db
        .update(Aceras)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(Aceras.codigoEdificio, data.codigoEdificio))
        .returning();
      return { success: true, data: result[0] };
    }

    // Si no existe, crear nuevo
    const result = await db.insert(Aceras).values({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    return { success: true, data: result[0] };
  } catch (error) {
    console.error("Error en createAceras:", error);
    return { success: false, error: "Error al crear/actualizar acera" };
  }
}

// Aplicar la misma lógica para terrenos y zonas verdes
export async function createTerrenos(data: any) {
  try {
    const existing = await checkExistingComponent(data.codigoEdificio, Terrenos);
    
    if (existing.length > 0) {
      const result = await db
        .update(Terrenos)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(Terrenos.codigoEdificio, data.codigoEdificio))
        .returning();
      return { success: true, data: result[0] };
    }

    const result = await db.insert(Terrenos).values({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    return { success: true, data: result[0] };
  } catch (error) {
    console.error("Error en createTerrenos:", error);
    return { success: false, error: "Error al crear/actualizar terreno" };
  }
}

export async function createZonasVerdes(data: any) {
  try {
    const existing = await checkExistingComponent(data.codigoEdificio, ZonasVerdes);
    
    if (existing.length > 0) {
      const result = await db
        .update(ZonasVerdes)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(ZonasVerdes.codigoEdificio, data.codigoEdificio))
        .returning();
      return { success: true, data: result[0] };
    }

    const result = await db.insert(ZonasVerdes).values({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    return { success: true, data: result[0] };
  } catch (error) {
    console.error("Error en createZonasVerdes:", error);
    return { success: false, error: "Error al crear/actualizar zona verde" };
  }
}

interface ComponentResult {
  aceras: { id: number } | null;
  zonasVerdes: { id: number } | null;
  terrenos: { id: number } | null;
  success: boolean;
  error?: string;
}

export async function createComponents(
  codigoEdificio: string,
  {
    aceras,
    zonasVerdes,
    terrenos,
  }: {
    aceras?: Omit<ComponentData, "codigoEdificio">;
    zonasVerdes?: Omit<ComponentData, "codigoEdificio">;
    terrenos?: Omit<ComponentData, "codigoEdificio">;
  },
) {
  const results: ComponentResult = {
    aceras: null,
    zonasVerdes: null,
    terrenos: null,
    success: true,
  };

  try {
    if (aceras) {
      const acerasResult = await createAceras({
        codigoEdificio,
        ...aceras,
      });
      if (!acerasResult.success) {
        throw new Error("Error creating aceras");
      }
      results.aceras = acerasResult.data ?? null;
    }

    if (zonasVerdes) {
      const zonasVerdesResult = await createZonasVerdes({
        codigoEdificio,
        ...zonasVerdes,
      });
      if (!zonasVerdesResult.success) {
        throw new Error("Error creating zonas verdes");
      }
      results.zonasVerdes = zonasVerdesResult.data ?? null;
    }

    if (terrenos) {
      const terrenosResult = await createTerrenos({
        codigoEdificio,
        ...terrenos,
      });
      if (!terrenosResult.success) {
        throw new Error("Error creating terrenos");
      }
      results.terrenos = terrenosResult.data ?? null;
    }

    return results;
  } catch (error) {
    console.error("Error creating components:", error);
    return { ...results, success: false, error: "Error creating components" };
  }
}
