"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "~/components/ui/table";
import { ArrowDown, ArrowUp } from "lucide-react";

interface Proyecto {
  _id: string;
  nombre: string;
  prioridad: number | null;
  tipoEdificacion: string;
  edificioSeleccionado?: string;
}

export default function RankingPriorizacion() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ordenAscendente, setOrdenAscendente] = useState(false);

  // Función para ordenar los proyectos
  const ordenarPorPrioridad = (proyectos: Proyecto[], ascendente: boolean) => {
    return [...proyectos].sort((a, b) => {
      const prioridadA = a.prioridad ?? 0;
      const prioridadB = b.prioridad ?? 0;
      return ascendente ? prioridadA - prioridadB : prioridadB - prioridadA;
    });
  };

  useEffect(() => {
    async function fetchProyectos() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/priorizacion");

        if (!response.ok) {
          throw new Error("Error al obtener los proyectos");
        }

        const data = await response.json();
        const proyectosTransformados = (data.data || []).map((proyecto: any) => ({
          _id: proyecto._id,
          nombre: proyecto.informacionGeneral?.nombre || "Sin nombre",
          prioridad: parseFloat(proyecto.totalGeneral) || null,
          tipoEdificacion: proyecto.informacionGeneral?.tipoEdificacion || "nuevo",
          edificioSeleccionado: proyecto.informacionGeneral?.edificioSeleccionado || null,
        }));
        const proyectosOrdenados = ordenarPorPrioridad(proyectosTransformados, ordenAscendente);
        setProyectos(proyectosOrdenados);
      } catch (error) {
        console.error("Error fetching proyectos:", error);
      } finally {
        setIsLoading(false);
      }
    }

    void fetchProyectos();
  }, [ordenAscendente]);

  // Manejador para cambiar el orden
  const cambiarOrden = () => {
    setOrdenAscendente((prevOrden) => !prevOrden);
  };

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Ranking de Priorización de Proyectos</CardTitle>
        <button
          onClick={cambiarOrden}
          className="flex items-center gap-1 text-sm text-primary hover:underline"
        >
          {ordenAscendente ? (
            <>
              <ArrowUp className="h-4 w-4" /> Ascendente
            </>
          ) : (
            <>
              <ArrowDown className="h-4 w-4" /> Descendente
            </>
          )}
        </button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
          </div>
        ) : proyectos.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No hay proyectos disponibles</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell className="font-medium">Nombre</TableCell>
                  <TableCell className="font-medium">Edificio</TableCell>
                  <TableCell className="font-medium">Prioridad</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {proyectos.map((proyecto) => (
                  <TableRow key={proyecto._id}>
                    <TableCell className="font-medium">{proyecto.nombre}</TableCell>
                    <TableCell>
                      {proyecto.tipoEdificacion === "existing"
                        ? proyecto.edificioSeleccionado || "Sin edificio asignado"
                        : "Sin edificio asignado"}
                    </TableCell>
                    <TableCell>{proyecto.prioridad !== null ? proyecto.prioridad.toFixed(2) : "N/A"}</TableCell>
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