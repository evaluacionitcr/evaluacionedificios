import { db } from "~/server/db";
import { NextResponse } from "next/server";
import { eq, and, desc } from "drizzle-orm";
import { Aceras, Terrenos, ZonasVerdes } from "~/server/db/schema";
import { type NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Usar el parámetro directamente en las consultas como string
    const [aceras, terrenos, zonasVerdes] = await Promise.all([
      db.select()
        .from(Aceras)
        .where(eq(Aceras.codigoEdificio, context.params.id))
        .orderBy(desc(Aceras.createdAt))
        .limit(1),

      db.select()
        .from(Terrenos)
        .where(eq(Terrenos.codigoEdificio, context.params.id))
        .orderBy(desc(Terrenos.createdAt))
        .limit(1),

      db.select()
        .from(ZonasVerdes)
        .where(eq(ZonasVerdes.codigoEdificio, context.params.id))
        .orderBy(desc(ZonasVerdes.createdAt))
        .limit(1)
    ]);

    console.log('Búsqueda por código:', context.params.id);
    console.log('Componentes encontrados:', { aceras, terrenos, zonasVerdes });

    const existingComponents = {
      aceras: aceras.length > 0 ? { ...aceras[0], isExisting: true } : null,
      terrenos: terrenos.length > 0 ? { ...terrenos[0], isExisting: true } : null,
      zonasVerdes: zonasVerdes.length > 0 ? { ...zonasVerdes[0], isExisting: true } : null,
    };

    return NextResponse.json(existingComponents);
  } catch (error) {
    console.error("Error al obtener componentes:", error);
    return NextResponse.json(
      { error: "Error al obtener los componentes" },
      { status: 500 }
    );
  }
}
