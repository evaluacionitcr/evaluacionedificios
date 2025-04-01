"use server";

import { db } from "~/server/db";

import { Sedes, NumeroFincas, UsosActuales, Edificaciones } from "~/server/db/schema"; 


export async function fetchSedes() {
  try {
    const sedes = await db.select().from(Sedes);
    return { success: true, data: sedes };
  } catch (error) {
    console.error("Error al obtener las sedes:", error);
    return { success: false, error: "No se pudieron cargar las sedes" };
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

export async function createEdificio(data: {
  codigoEdificio: string;
  sede: number;
  esRenovacion: boolean;
  nombre: string;
  fechaConstruccion: number;
  noFinca: number;
  m2Construccion: number;
  valorDolarPorM2: string  ;
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
    const edificio = await db.insert(Edificaciones).values(data).returning();
    return { success: true, data: edificio };
  } catch (error) {
    console.error("Error al crear edificio:", error);
    return { success: false, error: "No se pudo crear el edificio." };
  }
}