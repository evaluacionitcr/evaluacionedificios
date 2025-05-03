"use server";

import { db } from "~/server/db";
import { sql } from "drizzle-orm";
import { Componentes, EstadosConservacion, Funcionalidades, Normativas } from "~/server/db/schema";
import { revalidatePath } from "next/cache";
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server"; 

interface Componente {
  id: number;
  componente: string;
  peso: number;
  necesidadIntervencion: number;
  existencia: string;
  pesoEvaluado?: number;
  puntaje?: number;
  elementosValorar?: string;
}

interface Edificio {
  codigo: string;
  nombre: string;
  campus: string;
  usoActual: string;
  area: number;
  descripcion: string;
}

interface Depreciacion {
  principal: {
    edad: number;
    vidaUtil: number;
    estadoConservacionCoef: number;
    escalaDepreciacion: number;
  };
  remodelacion: {
    edad: number;
    vidaUtil: number;
    estadoConservacionCoef: number;
    porcentaje: number;
    escalaDepreciacion: number;
  };
  puntajeDepreciacionTotal: number;
}

interface Serviciabilidad {
  funcionalidadId: number;
  normativaId: number;
  puntajeServiciabilidad: number;
}

interface Evaluacion {
  edificio: Edificio;
  depreciacion: Depreciacion;
  componentes: Componente[];
  puntajeComponentes: number;
  serviciabilidad: Serviciabilidad;
  puntajeTotalEdificio: number;
  comentarios: Comentarios;
}

interface Comentarios {
  funcionalidad: string;
  normativa: string;
  componentesCriticos: string;
  mejorasRequeridas: string;
  registroFotografico: string;
}

const uri = process.env.MONGODB_URI || '';
const client = new MongoClient(uri);
const dbName ="evaluacionedificiositcr";
const collectionName ="evaluaciones";
const mongo = client.db(dbName);
const collection = mongo.collection(collectionName);

export async function getComponentes() {
  try {
    const componentes = await db.select().from(Componentes);
    return { success: true, data: componentes };
  }
  catch (error) {
    console.error("Error al obtener los componentes:", error);
    return { success: false, error: "No se pudieron cargar los componentes" };
  }
}

export async function getEstadoConservacion() {
    try {
        const estadoConservacion = await db.select().from(EstadosConservacion);
        return { success: true, data: estadoConservacion };
    } catch (error) {
        console.error("Error al obtener el estado de conservación:", error);
        return { success: false, error: "No se pudo cargar el estado de conservación" };
    }
}

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

export async function getNormativas() {
    try {
      const normativas = await db.select().from(Normativas);
      return { success: true, data: normativas };
    }
    catch (error) {
      console.error("Error al obtener las funcionalidades:", error);
      return { success: false, error: "No se pudieron cargar las funcionalidades" };
    }
  }

export async function guardarEvaluacion(evaluacion: Evaluacion) {
  try {
    await client.connect();
    
    const documentoEvaluacion = {
      ...evaluacion,
      createdAt: new Date(),
      revisado: false
    };

    const result = await collection.insertOne(documentoEvaluacion);
    
    revalidatePath('/evaluaciones');
    
    return { 
      success: true,
      message: "Evaluación guardada exitosamente",
      insertedId: result.insertedId
    };

  } catch (error) {
    console.error("Error al guardar la evaluación:", error);
    return { 
      success: false,
      message: "Error al guardar la evaluación",
      error: error instanceof Error ? error.message : "Error desconocido"
    };
  } finally {
    await client.close();
  }
}