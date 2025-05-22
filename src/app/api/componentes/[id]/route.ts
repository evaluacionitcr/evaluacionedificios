import { db } from "~/server/db";
import { NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";
import { Aceras, Terrenos, ZonasVerdes } from "~/server/db/schema";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const idStr = url.pathname.split("/").pop();
    const id = idStr ? parseInt(idStr) : null;

    if (!id || isNaN(id)) {
      return NextResponse.json(
        { error: "ID inválido o no proporcionado" },
        { status: 400 }
      );
    }

    const [aceras, terrenos, zonasVerdes] = await Promise.all([
      db.select()
        .from(Aceras)
        .where(eq(Aceras.idConstruccion, id))
        .orderBy(desc(Aceras.createdAt))
        .limit(1),

      db.select()
        .from(Terrenos)
        .where(eq(Terrenos.idConstruccion, id))
        .orderBy(desc(Terrenos.createdAt))
        .limit(1),

      db.select()
        .from(ZonasVerdes)
        .where(eq(ZonasVerdes.idConstruccion, id))
        .orderBy(desc(ZonasVerdes.createdAt))
        .limit(1)
    ]);

    console.log('Búsqueda por código:', id);
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
