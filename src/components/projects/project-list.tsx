"use client";

import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ChevronDown, ChevronUp, Search, Eye } from "lucide-react";
import Link from "next/link";
import { Eje, Criterio, Parametro, FormularioProyecto, ApiResponse, Evaluacion, EjeTotal } from "../../app/(dashboard)/priorizacion/types";


interface SedeProyectos {
  nombre: string;
  proyectos: FormularioProyecto[];
}

export default function ProjectList() {
  const [sedesConProyectos, setSedesConProyectos] = useState<SedeProyectos[]>([]);
  const [expandedSedes, setExpandedSedes] = useState<Record<string, boolean>>({});
  const [localSearches, setLocalSearches] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchProyectos = async () => {
    try {
      const response = await fetch('/api/priorizacion');
      const data = await response.json();
      
      if (data.status === "success") {
        // Agrupar proyectos por sede
        const proyectosPorSede = data.data.reduce((acc: Record<string, FormularioProyecto[]>, proyecto: FormularioProyecto) => {
          // Use sede if available (new building), otherwise use campusEdificio (existing building)
          const sede = proyecto.informacionGeneral.sede || proyecto.informacionGeneral.campusEdificio;
          
          if (!acc[sede]) {
            acc[sede] = [];
          }
          acc[sede].push(proyecto);
          return acc;
        }, {});

        // Convertir a array de SedeProyectos
        const sedesArray = Object.entries(proyectosPorSede).map(([nombre, proyectos]) => ({
          nombre,
          proyectos: proyectos as FormularioProyecto[]
        }));

        setSedesConProyectos(sedesArray);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchProyectos();
}, []);

  const toggleSede = (sedeNombre: string) => {
    setExpandedSedes(prev => ({
      ...prev,
      [sedeNombre]: !prev[sedeNombre]
    }));
  };

  const updateLocalSearch = (sedeNombre: string, searchTerm: string) => {
    setLocalSearches(prev => ({
      ...prev,
      [sedeNombre]: searchTerm
    }));
  };

  const getFilteredProyectos = (sede: SedeProyectos) => {
    const searchTerm = localSearches[sede.nombre] ?? "";
    
    if (!searchTerm.trim()) {
      return sede.proyectos;
    }
    
    return sede.proyectos.filter((proyecto) => {
      return proyecto.informacionGeneral.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
             proyecto.informacionGeneral.edificioSeleccionado.toLowerCase().includes(searchTerm.toLowerCase());
    });
  };

  if (loading) {
    return <div>Cargando proyectos...</div>;
  }

  return (
    <div className="space-y-4">
      {sedesConProyectos.map((sede) => {
        const filteredProyectos = getFilteredProyectos(sede);
        
        return (
          <div key={sede.nombre} className="rounded-lg bg-slate-50 shadow-sm">
            <div
              className="flex cursor-pointer items-center justify-between border-b p-4"
              onClick={() => toggleSede(sede.nombre)}
            >
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {sede.nombre === "undefined" ? "Sin Sede Asignada" : sede.nombre}
                </h2>
                <p className="text-sm text-slate-500">
                  {sede.proyectos.length} proyecto{sede.proyectos.length !== 1 ? "s" : ""}
                </p>
              </div>
              <Button variant="ghost" size="sm" className="p-1">
                {expandedSedes[sede.nombre] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </Button>
            </div>

            {expandedSedes[sede.nombre] && (
              <div className="p-4">
                <div className="mb-4 relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input 
                    type="search"
                    placeholder="Buscar proyectos en este campus..."
                    className="pl-10"
                    value={localSearches[sede.nombre] ?? ""}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => updateLocalSearch(sede.nombre, e.target.value)}
                  />
                </div>
                
                {filteredProyectos.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredProyectos.map((proyecto) => (
                      <div key={proyecto.informacionGeneral.nombre} className="rounded-lg border p-4 bg-white">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{proyecto.informacionGeneral.nombre}</h3>
                        </div>
                        <p className="text-sm text-gray-600">
                          Edificio: {proyecto.informacionGeneral.nombreEdificio && proyecto.informacionGeneral.nombreEdificio.trim() !== "" 
                          ? proyecto.informacionGeneral.nombreEdificio 
                          : "Sin Edificio Asignado"}
                        </p>
                        <p className="text-sm text-gray-600">
                          Código de Edificio: {proyecto.informacionGeneral.edificioSeleccionado === "" ? "Sin Código Asignado" : proyecto.informacionGeneral.edificioSeleccionado}
                        </p>
                        <p className="text-sm text-gray-600">
                          Puntaje Total: {proyecto.totalGeneral}
                        </p>
                        <div className="mt-4 flex justify-center">
                          <Link href={`/priorizacion/${proyecto._id}`} className="w-full">
                            <Button variant="default" className="w-full flex items-center justify-center">
                              <Eye size={16} className="inline-block ml-1" /> Ver Detalles
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                    <h3 className="mb-2 text-lg font-medium">No se encontraron proyectos</h3>
                    <p className="text-sm text-muted-foreground">
                      No hay proyectos que coincidan con tu búsqueda en este campus.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}