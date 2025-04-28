import { NextRequest, NextResponse } from "next/server";
import { getDetallesEdificio } from "~/server/actions/edificios";
import { db } from "~/server/db";
import { Construcciones } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  {params} : { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID no proporcionado" },
        { status: 400 }
      );
    }

    const edificios = await getDetallesEdificio(id);
    
    if (edificios.length === 0) {
      return NextResponse.json(
        { success: false, error: "No se encontró el edificio" },
        { status: 404 }
      );
    }

    // Obtener el ID de la sede del primer edificio
    const edificio = edificios[0]!;
    
    // Agregar el ID de la sede al objeto de respuesta
    const edificioConSedeId = {
      ...edificio,
      sedeId: edificio.sede,
    };

    console.log("Edificio con sedeId:", edificioConSedeId); // Debug log

    return NextResponse.json({
      success: true,
      data: [edificioConSedeId],
    });
  } catch (error) {
    console.error("Error al obtener detalles del edificio:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener detalles del edificio" },
      { status: 500 }
    );
  }
} 

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID no proporcionado" },
        { status: 400 }
      );
    }

    const edificio = await db
      .update(Construcciones)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(Construcciones.codigoEdificio, id))
      .returning();

    if (!edificio || edificio.length === 0) {
      return NextResponse.json(
        { success: false, error: "No se encontró el edificio" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: edificio[0],
    });
  } catch (error) {
    console.error("Error al actualizar el edificio:", error);
    return NextResponse.json(
      { success: false, error: "Error al actualizar el edificio" },
      { status: 500 }
    );
  }
} 