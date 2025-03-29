import { NextResponse } from "next/server";
import { insertarDatos } from "~/server/db/inserts";

export async function POST() {
  try {
    await insertarDatos();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al insertar datos:", error);
    return NextResponse.json(
      { error: "Error al insertar datos" },
      { status: 500 },
    );
  }
}
