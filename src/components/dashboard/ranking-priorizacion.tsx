"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "~/components/ui/table";
import { ArrowDown, ArrowUp, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";

interface Proyecto {
  _id: string;
  nombre: string;
  prioridad: number | null;
  tipoEdificacion: string;
  edificioSeleccionado?: string;
  nombreEdificio?: string | null;
  campusEdificio?: string | null;
  sede?: string | null;
}

interface ApiProyecto {
  _id: string;
  totalGeneral: string | number;
  informacionGeneral?: {
    nombre?: string;
    tipoEdificacion?: string;
    edificioSeleccionado?: string;
    nombreEdificio?: string;
    campusEdificio?: string;
    sede?: string;
  };
}

interface ApiResponse {
  data: ApiProyecto[];
}

export default function RankingPriorizacion() {
  const router = useRouter();
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

        const data = await response.json() as unknown;
        const apiResponse = data as ApiResponse;
        const proyectosTransformados = (apiResponse.data ?? []).map((proyecto: ApiProyecto): Proyecto => ({
          _id: proyecto._id,
          nombre: proyecto.informacionGeneral?.nombre ?? "Sin nombre",
          prioridad: parseFloat(String(proyecto.totalGeneral)) || null,
          tipoEdificacion: proyecto.informacionGeneral?.tipoEdificacion ?? "nuevo",
          edificioSeleccionado: proyecto.informacionGeneral?.edificioSeleccionado ?? undefined,
          nombreEdificio: proyecto.informacionGeneral?.nombreEdificio ?? null,
          campusEdificio: proyecto.informacionGeneral?.campusEdificio ?? null,
          sede: proyecto.informacionGeneral?.sede ?? null,
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

  return (    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Ranking de Priorización de Proyectos</CardTitle>
        <button onClick={cambiarOrden} className="flex items-center gap-1 text-sm text-primary hover:underline">
          {ordenAscendente ? <><ArrowUp className="h-4 w-4" />Ascendente</> : <><ArrowDown className="h-4 w-4" />Descendente</>}
        </button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700" />
          </div>
        ) : proyectos.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No hay proyectos disponibles</p>
        ) : (
          <div className="overflow-x-auto">
            <Table><TableHeader><TableRow>
              <TableCell className="font-medium">Nombre Proyecto</TableCell>
              <TableCell className="font-medium">Código Edificio</TableCell>
              <TableCell className="font-medium">Nombre Edificio</TableCell>
              <TableCell className="font-medium">Campus</TableCell>
              <TableCell className="font-medium">Prioridad (Puntaje)</TableCell>
              <TableCell className="font-medium">Acciones</TableCell>
            </TableRow></TableHeader><TableBody>{proyectos.map(proyecto => (              <TableRow key={proyecto._id}>
                <TableCell className="font-medium">{proyecto.nombre}</TableCell>
                <TableCell>{proyecto.tipoEdificacion === "existing" ? proyecto.edificioSeleccionado ?? "-" : "-"}</TableCell>
                <TableCell>{proyecto.tipoEdificacion === "existing" ? proyecto.nombreEdificio ?? "Sin edificio asociado" : "Sin edificio asociado"}</TableCell>
                <TableCell>{proyecto.tipoEdificacion === "existing" ? proyecto.campusEdificio ?? "-" : proyecto.sede ?? "-"}</TableCell>
                <TableCell>{proyecto.prioridad !== null ? proyecto.prioridad.toFixed(2) : "N/A"}</TableCell>
                <TableCell>
                  <Button 
                    onClick={() => router.push(`/priorizacion/${proyecto._id}`)}
                    size="sm"
                    variant="ghost"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ver
                  </Button>
                </TableCell>
              </TableRow>))}</TableBody></Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}