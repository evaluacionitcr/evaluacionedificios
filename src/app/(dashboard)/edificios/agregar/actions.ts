"use server";

import { db } from "~/server/db";
import { sql } from "drizzle-orm";

import { Sedes, NumeroFincas, UsosActuales, Construcciones } from "~/server/db/schema"; 


export async function fetchSedes() {
  try {
    const sedes = await db.select().from(Sedes);
    return { success: true, data: sedes };
  } catch (error) {
    console.error("Error al obtener los campus/centros académicos:", error);
    return { success: false, error: "No se pudieron cargar los campus/centros académicos" };
  }
}

export async function fetchFincas() {
    try {
        const fincas = await db.select().from(NumeroFincas);
        return { success: true, data: fincas };
    } catch (error) {
        console.error("Error al obtener las fincas:", error);
        return { success: false, error: "No se pudieron cargar las fincas" };
    }
}

export async function fetchUsosActuales() {
    try {
        const usos = await db.select().from(UsosActuales); // Cambia esto al nombre correcto de la tabla de Usos
        return { success: true, data: usos };
    } catch (error) {
        console.error("Error al obtener los usos:", error);
        return { success: false, error: "No se pudieron cargar los usos" };
    }
}

import { revalidatePath } from "next/cache";

export async function createEdificio(data: {
  codigoEdificio: string;
  sede: number;
  esRenovacion: boolean;
  nombre: string;
  fechaConstruccion: number;
  noFinca: number;
  m2Construccion: number;
  valorDolarPorM2: string;
  valorColonPorM2: string;
  edadAl2021: number;
  vidaUtilHacienda: number;
  vidaUtilExperto: number;
  valorEdificioIR: string;
  depreciacionLinealAnual: string;
  valorActualRevaluado: string;
  anoDeRevaluacion: number;
  usoActual: number;
  createdAt: Date;
  updatedAt: Date;
}) {
  try {
    const edificio = await db.insert(Construcciones).values(data).returning();

    // Añadir esta línea para revalidar la página de edificios
    revalidatePath("/edificios");

    return { success: true, data: edificio };
  } catch (error) {
    console.error("Error al crear edificio:", error);
    return { success: false, error: "No se pudo crear el edificio." };
  }
}

export async function checkCodigoEdificioExists(codigo: string) {
  try {
    const edificios = await db
      .select({ id: Construcciones.id })
      .from(Construcciones)
      .where(sql`LOWER(${Construcciones.codigoEdificio}) = LOWER(${codigo})`)
      .limit(1);
    
    return { 
      exists: edificios.length > 0,
      success: true 
    };
  } catch (error) {
    console.error("Error al verificar el código de edificio:", error);
    return { 
      exists: false, 
      success: false, 
      error: "No se pudo verificar el código de edificio." 
    };
  }
}



