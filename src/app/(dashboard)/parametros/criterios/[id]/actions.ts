"use server";

import { db } from "~/server/db";
import { sql } from "drizzle-orm";
import { CriteriosPriorizacion, ParametrosPriorizacion } from "~/server/db/schema";
import { revalidatePath } from "next/cache";

export async function getEjeById(id: number) {
  try {
    const eje = await db.query.EjesPriorizacion.findFirst({
      where: (ejes, { eq }) => eq(ejes.id, id),
    });
    return eje;
  } catch (error) {
    console.error('Error al obtener el eje:', error);
    throw new Error('No se pudo obtener el eje');
  }
}

export async function getCriteriosByEjeId(ejeId: number) {
  try {
    const criterios = await db.query.CriteriosPriorizacion.findMany({
      where: (criterios, { eq }) => eq(criterios.ejesPriorizacionId, ejeId),
    });
    return criterios;
  } catch (error) {
    console.error('Error al obtener criterios:', error);
    throw new Error('No se pudieron obtener los criterios');
  }
}

export async function getParametrosByCriterioId(criterioId: number) {
  try {
    const parametros = await db.query.ParametrosPriorizacion.findMany({
      where: (parametros, { eq }) => eq(parametros.criteriosPriorizacionId, criterioId),
    });
    return parametros;
  } catch (error) {
    console.error('Error al obtener parámetros:', error);
    throw new Error('No se pudieron obtener los parámetros');
  }
}

export async function createCriterio(data: { criterio: string; peso: number; ejeId: number }) {
  try {
    const result = await db.insert(CriteriosPriorizacion).values({
      criterio: data.criterio,
      peso: data.peso.toString(), // Convertir a string
      ejesPriorizacionId: data.ejeId,
    }).returning();
    
    revalidatePath('/parametros/criterios/[id]');
    return result[0];
  } catch (error) {
    console.error('Error al crear criterio:', error);
    throw new Error('No se pudo crear el criterio');
  }
}

export async function createParametro(data: { parametro: string; peso: number; criterioId: number }) {
  try {
    const result = await db.insert(ParametrosPriorizacion).values({
      parametro: data.parametro,
      peso: data.peso.toString(), // Convertir a string
      criteriosPriorizacionId: data.criterioId,
    }).returning();
    
    revalidatePath('/parametros/criterios/[id]');
    return result[0];
  } catch (error) {
    console.error('Error al crear parámetro:', error);
    throw new Error('No se pudo crear el parámetro');
  }
}

export async function updateCriterio(data: { id: number; criterio: string; peso: number }) {
  try {
    const result = await db.update(CriteriosPriorizacion)
      .set({
        criterio: data.criterio,
        peso: data.peso.toString(), // Convertir a string
      })
      .where(sql`${CriteriosPriorizacion.id} = ${data.id}`)
      .returning();
    
    revalidatePath('/parametros/criterios/[id]');
    return result[0];
  } catch (error) {
    console.error('Error al actualizar criterio:', error);
    throw new Error('No se pudo actualizar el criterio');
  }
}

export async function updateParametro(data: { id: number; parametro: string; peso: number }) {
  try {
    const result = await db.update(ParametrosPriorizacion)
      .set({
        parametro: data.parametro,
        peso: data.peso.toString(), // Convertir a string
      })
      .where(sql`${ParametrosPriorizacion.id} = ${data.id}`)
      .returning();
    
    revalidatePath('/parametros/criterios/[id]');
    return result[0];
  } catch (error) {
    console.error('Error al actualizar parámetro:', error);
    throw new Error('No se pudo actualizar el parámetro');
  }
}

export async function deleteCriterio(id: number) {
  try {
    await db.delete(CriteriosPriorizacion)
      .where(sql`${CriteriosPriorizacion.id} = ${id}`);
    
    revalidatePath('/parametros/criterios/[id]');
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar criterio:', error);
    throw new Error('No se pudo eliminar el criterio');
  }
}

export async function deleteParametro(id: number) {
  try {
    await db.delete(ParametrosPriorizacion)
      .where(sql`${ParametrosPriorizacion.id} = ${id}`);
    
    revalidatePath('/parametros/criterios/[id]');
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar parámetro:', error);
    throw new Error('No se pudo eliminar el parámetro');
  }
}