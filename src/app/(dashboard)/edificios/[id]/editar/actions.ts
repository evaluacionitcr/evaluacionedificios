"use server";

import { db } from "~/server/db";
import { sql } from "drizzle-orm";
import { Sedes, NumeroFincas, UsosActuales, Construcciones } from "~/server/db/schema";
import { eq } from "drizzle-orm";

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
    const usos = await db.select().from(UsosActuales);
    return { success: true, data: usos };
  } catch (error) {
    console.error("Error al obtener los usos:", error);
    return { success: false, error: "No se pudieron cargar los usos" };
  }
}

// Función auxiliar para convertir string con formato "1.234,56" a número "1234.56"
function parseSpanishNumber(value: string): number {
  // Eliminar los puntos de los miles y reemplazar la coma por punto
  return parseFloat(value.replace(/\./g, "").replace(",", "."));
}

export async function updateEdificio(id: string, data: {
  sede: number;
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
}) {
  try {
    console.log("ID del edificio a actualizar:", id);

    // Primero verificamos si el edificio existe usando una consulta case-insensitive
    const edificioExistente = await db
      .select()
      .from(Construcciones)
      .where(sql`LOWER(${Construcciones.codigoEdificio}) = LOWER(${id})`);

    console.log("Edificio existente:", edificioExistente);

    if (!edificioExistente || edificioExistente.length === 0) {
      return { success: false, error: "No se encontró el edificio con el código especificado" };
    }

    // Convertir los valores string con formato español a números
    const formattedData = {
      ...data,
      valorDolarPorM2: parseSpanishNumber(data.valorDolarPorM2).toString(),
      valorColonPorM2: parseSpanishNumber(data.valorColonPorM2).toString(),
      valorEdificioIR: parseSpanishNumber(data.valorEdificioIR).toString(),
      depreciacionLinealAnual: parseSpanishNumber(data.depreciacionLinealAnual).toString(),
      valorActualRevaluado: parseSpanishNumber(data.valorActualRevaluado).toString(),
    };

    console.log("Datos formateados:", formattedData);

    const edificioActualizado = await db
      .update(Construcciones)
      .set({
        ...formattedData,
        updatedAt: new Date(),
      })
      .where(sql`LOWER(${Construcciones.codigoEdificio}) = LOWER(${id})`)
      .returning();

    console.log("Resultado de la actualización:", edificioActualizado);

    if (!edificioActualizado || edificioActualizado.length === 0) {
      return { success: false, error: "No se pudo actualizar el edificio" };
    }

    return { success: true, data: edificioActualizado[0] };
  } catch (error) {
    console.error("Error al actualizar edificio:", error);
    return { success: false, error: "No se pudo actualizar el edificio" };
  }
} 