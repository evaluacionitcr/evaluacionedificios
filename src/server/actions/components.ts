"use server";
import { db } from "~/server/db";
import { Aceras, ZonasVerdes, Terrenos } from "../db/schema";
import { revalidatePath } from "next/cache";

interface ComponentData {
  codigoEdificio: string;
  m2Construccion: number;
  valorDolarPorM2: string;
  vidaUtilHacienda?: number;
  vidaUtilExperto?: number;
}

export async function createAceras(data: ComponentData) {
  try {
    const [acera] = await db
      .insert(Aceras)
      .values({
        codigoEdificio: data.codigoEdificio,
        nombre: `Acera de ${data.codigoEdificio}`,
        m2Construccion: data.m2Construccion,
        valorDolarPorM2: data.valorDolarPorM2,
        vidaUtilHacienda: data.vidaUtilHacienda,
        vidaUtilExperto: data.vidaUtilExperto,
      })
      .returning({ id: Aceras.id });

    revalidatePath(`/edificios/${data.codigoEdificio}`);
    return { success: true, data: acera };
  } catch (error) {
    console.error("Error al crear acera:", error);
    return { success: false, error: "Error al crear acera" };
  }
}

export async function createZonasVerdes(data: ComponentData) {
  try {
    const [zonaVerde] = await db
      .insert(ZonasVerdes)
      .values({
        codigoEdificio: data.codigoEdificio,
        nombre: `Zona Verde de ${data.codigoEdificio}`,
        m2Construccion: data.m2Construccion,
        valorDolarPorM2: data.valorDolarPorM2,
        vidaUtilHacienda: data.vidaUtilHacienda,
        vidaUtilExperto: data.vidaUtilExperto,
      })
      .returning({ id: ZonasVerdes.id });

    revalidatePath(`/edificios/${data.codigoEdificio}`);
    return { success: true, data: zonaVerde };
  } catch (error) {
    console.error("Error al crear zona verde:", error);
    return { success: false, error: "Error al crear zona verde" };
  }
}

export async function createTerrenos(data: ComponentData) {
  try {
    const [terreno] = await db
      .insert(Terrenos)
      .values({
        codigoEdificio: data.codigoEdificio,
        nombre: `Terreno de ${data.codigoEdificio}`,
        m2Construccion: data.m2Construccion,
        valorDolarPorM2: data.valorDolarPorM2,
      })
      .returning({ id: Terrenos.id });

    revalidatePath(`/edificios/${data.codigoEdificio}`);
    return { success: true, data: terreno };
  } catch (error) {
    console.error("Error al crear terreno:", error);
    return { success: false, error: "Error al crear terreno" };
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
