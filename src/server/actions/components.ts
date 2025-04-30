"use server";
import { db } from "~/server/db";
import { Aceras, ZonasVerdes, Terrenos } from "../db/schema";
import { eq } from "drizzle-orm";
import type { PgTableWithColumns } from "drizzle-orm/pg-core";

export interface ComponentData {
  idConstruccion?: number | null;
  codigoEdificio: string;
  nombre: string;
  fechaConstruccion?: number | null;
  m2Construccion: number;
  valorDolarPorM2: string;
  valorColonPorM2: string;
  edad?: number | null;
  vidaUtilHacienda: number;
  vidaUtilExperto: number;
  valorReposicion: string;
  depreciacionLinealAnual: string;
  valorActualRevaluado: string;
  anoDeRevaluacion?: number | null;
  noFinca?: number | null;
  usoActual?: number | null;
  valorPorcionTerreno?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// Helper function to check existing component with proper typing
async function checkExistingComponent(
  codigoEdificio: string,
  table: typeof Aceras | typeof ZonasVerdes | typeof Terrenos
) {
  return await db
    .select()
    .from(table)
    .where(eq(table.codigoEdificio, codigoEdificio));
}

export async function createAceras(data: ComponentData) {
  try {
    const existing = await checkExistingComponent(data.codigoEdificio, Aceras);
    
    if (existing.length > 0) {
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

export async function createTerrenos(data: ComponentData) {
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

export async function createZonasVerdes(data: ComponentData) {
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
): Promise<ComponentResult> {
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
