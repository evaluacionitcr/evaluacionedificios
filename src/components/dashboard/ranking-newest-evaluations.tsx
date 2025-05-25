"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "~/components/ui/table";
import { Eye, ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import Link from "next/link";

interface Evaluacion {
  _id: string;
  edificio: {
    codigo: string;
    nombre: string;
    campus: string;
    usoActual: string;
    area: number;
    descripcion: string;
  };
  createdAt: Date;
  estado: string;
  puntajeTotalEdificio?: number;
}

export default function RankingNewestEvaluations() {
  const [ultimasEvaluaciones, setUltimasEvaluaciones] = useState<Evaluacion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ordenAscendente, setOrdenAscendente] = useState(false);

  // Función para ordenar las evaluaciones
  const ordenarPorPuntaje = (evaluaciones: Evaluacion[], ascendente: boolean) => {
    return [...evaluaciones].sort((a, b) => {
      // Si alguno no tiene puntaje, lo tratamos diferente
      if (!a.puntajeTotalEdificio && !b.puntajeTotalEdificio) return 0;
      if (!a.puntajeTotalEdificio) return ascendente ? -1 : 1;
      if (!b.puntajeTotalEdificio) return ascendente ? 1 : -1;
      
      // Ordenamos según ascendente o descendente
      return ascendente 
        ? a.puntajeTotalEdificio - b.puntajeTotalEdificio 
        : b.puntajeTotalEdificio - a.puntajeTotalEdificio;
    });
  };

  useEffect(() => {
    async function fetchUltimasEvaluaciones() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/evaluaciones/ultimas");
        
        if (!response.ok) {
          throw new Error("Error al obtener las evaluaciones más recientes");
        }

        const data = await response.json();
        // Ordenamos por puntaje más alto (descendente por defecto)
        const evaluacionesOrdenadas = ordenarPorPuntaje(data.data || [], ordenAscendente);
        setUltimasEvaluaciones(evaluacionesOrdenadas);
      } catch (error) {
        console.error("Error fetching últimas evaluaciones:", error);
      } finally {
        setIsLoading(false);
      }
    }

    void fetchUltimasEvaluaciones();
  }, [ordenAscendente]);

  // Manejador para cambiar el orden
  const cambiarOrden = () => {
    setOrdenAscendente(prevOrden => !prevOrden);
  };
  // Formatear la fecha para mostrarla de forma legible
  const formatFecha = (fecha: Date) => {
    if (!fecha) return "Sin fecha";
    const date = new Date(fecha);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  // Determinar el color según el puntaje
  const getPuntajeColor = (puntaje?: number) => {
    if (!puntaje) return "text-gray-500";
    if (puntaje >= 75) return "text-green-600";
    if (puntaje >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Ranking de Últimas Evaluaciones</CardTitle>
        <Button
          onClick={cambiarOrden}
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
        >
          {ordenAscendente ? (
            <>
              <ArrowUp className="h-4 w-4" />
              Ascendente
            </>
          ) : (
            <>
              <ArrowDown className="h-4 w-4" />
              Descendente
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
          </div>
        ) : ultimasEvaluaciones.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No hay evaluaciones disponibles</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell className="font-medium">Código</TableCell>
                  <TableCell className="font-medium">Edificio</TableCell>
                  <TableCell className="font-medium">Campus</TableCell>
                  <TableCell className="font-medium">Fecha</TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      Puntaje
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-right">Acción</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ultimasEvaluaciones.map((evaluacion) => (
                  <TableRow key={evaluacion._id}>
                    <TableCell className="font-medium">{evaluacion.edificio.codigo}</TableCell>
                    <TableCell className="font-medium">{evaluacion.edificio.nombre}</TableCell>
                    <TableCell>{evaluacion.edificio.campus}</TableCell>
                    <TableCell>{formatFecha(evaluacion.createdAt)}</TableCell>                    
                    <TableCell>
                        {evaluacion.puntajeTotalEdificio ? `${evaluacion.puntajeTotalEdificio.toFixed(2)}` : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/evaluaciones/${evaluacion._id}/evaluacion`}>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}