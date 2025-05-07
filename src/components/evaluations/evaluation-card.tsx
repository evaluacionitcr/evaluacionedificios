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
import { Eye } from "lucide-react";

interface Edificio {
  id: number;
  nombre: string;
  codigo: string;
}

interface Evaluacion {
  _id: string;
  createdAt: string;
  estado: string;
  puntajeTotalEdificio: number;
}

export default function EvaluatedBuildingCard({
  edificio,
  evaluaciones,
}: {
  edificio: Edificio;
  evaluaciones: Evaluacion[];
}) {
  const cantidadEvaluaciones = evaluaciones.length;

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
            Evalauciones: {cantidadEvaluaciones}
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
            passHref
            className="w-full"
          >
            <Button variant="default" className="w-full">
              Ver evaluaciones <Eye size={16} className="inline-block ml-1" />
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
