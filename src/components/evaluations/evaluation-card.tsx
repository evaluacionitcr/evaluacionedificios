"use client";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import Link from "next/link";
import { Eye, ClipboardList } from "lucide-react";
import { useEffect } from "react";

interface Edificio {
  id: number;
  nombre: string;
  codigo: string;
}

export default function EvaluatedBuildingCard({
  edificio,
  evaluaciones,
}: {
  edificio: Edificio;
  evaluaciones: any[]; // Podrías definir una tipificación más precisa para las evaluaciones
}) {
  // Definir la "bandera" como la cantidad de evaluaciones
  const cantidadEvaluaciones = evaluaciones.length;

  // Usar useEffect para llamar el console.log cuando las evaluaciones cambien
  useEffect(() => {
    console.log(`Cantidad de evaluaciones: ${cantidadEvaluaciones}`);
  }, [cantidadEvaluaciones]); // Dependencia: ejecuta el log cuando 'cantidadEvaluaciones' cambie

  return (
    <Card className="rounded-lg border p-4 shadow-sm bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{edificio.nombre}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Código: {edificio.codigo}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Mostrar la cantidad de evaluaciones solo si es mayor que 0 */}
        {cantidadEvaluaciones > 0 ? (
          <p className="mt-2 text-sm text-gray-700">
            Evalauciones: {cantidadEvaluaciones}{cantidadEvaluaciones !== 1 ? "es" : ""}
          </p>
        ) : (
          <p className="mt-2 text-sm text-gray-700">No hay evaluaciones.</p>
        )}
      </CardContent>

    <CardFooter className="flex gap-2">
      {/* Mostrar botón solo si hay evaluaciones */}
      {cantidadEvaluaciones > 0 && (
        <Link
      href={`/evaluaciones/${encodeURIComponent(edificio.codigo.toLowerCase())}`}
      passHref className="w-full"
        >
      <Button
        variant="default"
        className="w-full"
      >
        Ver evaluaciones <Eye size={16} className="inline-block ml-1" />
      </Button>
        </Link>
      )}
    </CardFooter>

    </Card>
  );
}
