"use server";

import { db } from "~/server/db";
import { NumeroFincas, UsosActuales, Construcciones } from "~/server/db/schema";
import { revalidatePath } from "next/cache";

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
    const usos = await db.select().from(UsosActuales);
    return { success: true, data: usos };
  } catch (error) {
    console.error("Error al obtener los usos:", error);
    return { success: false, error: "No se pudieron cargar los usos" };
  }
}

export async function createRemodelacion(data: {
  codigoEdificio: string;
  sede: number | null;
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

    // Revalidar la página de detalles del edificio
    revalidatePath(`/edificios/${data.codigoEdificio}`);

    return { success: true, data: edificio };
  } catch (error) {
    console.error("Error al crear la remodelación:", error);
    return { success: false, error: "No se pudo crear la remodelación." };
  }
} 