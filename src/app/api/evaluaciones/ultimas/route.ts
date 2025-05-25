import { NextResponse } from "next/server";
import { getUltimaEvaluacionDeEdificio } from "~/server/actions/evaluaciones";

export async function GET() {
  try {
    const ultimasEvaluaciones = await getUltimaEvaluacionDeEdificio();
    
    return NextResponse.json({
      status: "success",
      data: ultimasEvaluaciones,
    });
  } catch (error) {
    console.error("Error al obtener las últimas evaluaciones:", error);
    return NextResponse.json(
      { status: "error", message: "Error al obtener las últimas evaluaciones" },
      { status: 500 }
    );
  }
}
