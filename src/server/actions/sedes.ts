import { db } from "~/server/db";
import { Sedes } from "../db/schema"; // Asegúrate de que la ruta es correcta

export async function getSedes() {
  try {
    const sedes = await db.select().from(Sedes);
    return sedes;
  } catch (error) {
    console.error("Error al obtener las sedes:", error);
    throw new Error("No se pudieron obtener las sedes");
  }
}
