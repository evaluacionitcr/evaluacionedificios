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

export async function createSede(nombre: string) {
  try {
    const sede = await db.insert(Sedes).values({
      nombre: nombre
    }).returning();
    
    return { success: true, data: sede[0] };
  } catch (error) {
    console.error("Error al crear sede:", error);
    return { success: false, error: "No se pudo crear la sede." };
  }
}

export async function createFinca(numero: string) {
  try {
    const finca = await db.insert(NumeroFincas).values({
      numero: numero
    }).returning();
    
    return { success: true, data: finca[0] };
  } catch (error) {
    console.error("Error al crear finca:", error);
    return { success: false, error: "No se pudo crear la finca." };
  }
}

export async function createEdificio(data: {
  codigoEdificio: string;
  sede: number | null;
  nuevaSede?: string | null;
  esRenovacion: boolean;
  nombre: string;
  fechaConstruccion: number;
  noFinca: number | null;
  nuevaFinca?: string | null;
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
    // Crear sede si es necesario
    let sedeId = data.sede;
    if (!sedeId && data.nuevaSede) {
      console.log("Creando nueva sede:", data.nuevaSede);
      const nuevaSede = await createSede(data.nuevaSede);
      if (!nuevaSede.success || !nuevaSede.data) {
        throw new Error("No se pudo crear la nueva sede: " + nuevaSede.error);
      }
      sedeId = nuevaSede.data.id;
      console.log("Nueva sede creada con ID:", sedeId);
    }

    // Crear finca si es necesario
    let fincaId = data.noFinca;
    if (!fincaId && data.nuevaFinca) {
      console.log("Creando nueva finca:", data.nuevaFinca);
      const nuevaFinca = await createFinca(data.nuevaFinca);
      if (!nuevaFinca.success || !nuevaFinca.data) {
        throw new Error("No se pudo crear la nueva finca: " + nuevaFinca.error);
      }
      fincaId = nuevaFinca.data.id;
      console.log("Nueva finca creada con ID:", fincaId);
    }

    // Datos del edificio sin las propiedades adicionales
    const edificioData = {
      ...data,
      sede: sedeId,
      noFinca: fincaId
    };

    // Eliminamos las propiedades adicionales
    delete edificioData.nuevaSede;
    delete edificioData.nuevaFinca;
    
    console.log("Datos del edificio a crear:", JSON.stringify(edificioData));
    
    const edificio = await db.insert(Construcciones).values(edificioData).returning();

    // Añadir esta línea para revalidar la página de edificios
    revalidatePath("/edificios");

    return { success: true, data: edificio };
  } catch (error) {
    console.error("Error al crear edificio:", error);
    return { success: false, error: error instanceof Error ? error.message : "No se pudo crear el edificio." };
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



