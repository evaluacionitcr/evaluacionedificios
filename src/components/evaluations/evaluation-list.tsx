"use client";

import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import EvaluatedBuildingCard from "./evaluation-card";

// Definimos la tipificación para hacer el código más seguro
interface Edificio {
  id: number;
  nombre: string;
  codigo: string;
}

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
  depreciacion: {
    principal: {
      edad: number;
      vidaUtil: number;
      estadoConservacionCoef: number;
      escalaDepreciacion: number;
    };
    remodelacion: {
      edad: number;
      vidaUtil: number;
      estadoConservacionCoef: number;
      porcentaje: number;
      escalaDepreciacion: number;
    };
    puntajeDepreciacionTotal: number;
  };
  componentes: {
    id: number;
    componente: string;
    peso: number;
    existencia: string;
    necesidadIntervencion: number;
    pesoEvaluado: number;
    puntaje: number;
  }[];
  puntajeComponentes: number;
  serviciabilidad: {
    funcionalidadId: number;
    normativaId: number;
    puntajeServiciabilidad: number;
  };
  puntajeTotalEdificio: number;
  comentarios: {
    funcionalidad: string;
    normativa: string;
    componentesCriticos: string;
    mejorasRequeridas: string;
    registroFotografico: string;
  };
  createdAt: string; 
  estado: string;
  revisado: boolean;
}

interface Sede {
  id: number;
  nombre: string;
  edificios: Edificio[];
}

interface EvaluatedBuildingsContainerProps {
  sedesConEdificios: Sede[];
}

export default function EvaluatedBuildingsContainer({
  sedesConEdificios,
}: EvaluatedBuildingsContainerProps) {
  const [evaluacionesPorCodigo, setEvaluacionesPorCodigo] = useState<Record<string, Evaluacion[]>>({});
  const [expandedSedes, setExpandedSedes] = useState<Record<number, boolean>>({});
  const [localSearches, setLocalSearches] = useState<Record<number, string>>({});
  const toggleSede = (sedeId: number) => {
    setExpandedSedes((prev) => ({
      ...prev,
      [sedeId]: !prev[sedeId],
    }));
  };

  const updateLocalSearch = (sedeId: number, searchTerm: string) => {
    setLocalSearches((prev) => ({
      ...prev,
      [sedeId]: searchTerm,
    }));
  };

  const getFilteredEdificios = (sede: Sede) => {
    const searchTerm = localSearches[sede.id] ?? "";

    if (!searchTerm.trim()) {
      return sede.edificios;
    }

    return sede.edificios.filter((edificio) => {
      const nombreMatch = edificio.nombre?.includes(searchTerm) || false;
      const codigoMatch = edificio.codigo?.includes(searchTerm) || false;
      return nombreMatch || codigoMatch;
    });
  };

  useEffect(() => {
    async function fetchEvaluaciones() {
      const response = await fetch("/api/evaluaciones");
      if (response.ok) {
        const data = await response.json();
  
        // Agrupar evaluaciones por código de edificio
        const agrupadasPorCodigo: Record<string, Evaluacion[]> = {};
  
        for (const evaluacion of data.data) {
          const codigo = evaluacion.edificio?.codigo;
          if (!codigo) continue;
  
          if (!agrupadasPorCodigo[codigo]) {
            agrupadasPorCodigo[codigo] = [];
          }
          agrupadasPorCodigo[codigo].push(evaluacion);
        }
  
        setEvaluacionesPorCodigo(agrupadasPorCodigo);
      } else {
        console.error("Error al obtener evaluaciones");
      }
    }
  
    fetchEvaluaciones();
  }, []);

  const getEvaluacionesForEdificio = (codigo: string) => {
    return evaluacionesPorCodigo[codigo] || [];
  };

  // Mapeo de códigos de edificios
  const codigoToEdificio = new Map<string, Edificio>();
  for (const sede of sedesConEdificios) {
    for (const edificio of sede.edificios) {
      codigoToEdificio.set(edificio.codigo, edificio);
    }
  }

  return (
    <div className="space-y-4">
      {sedesConEdificios.map((sede) => {
        const filteredEdificios = getFilteredEdificios(sede);

        return (
          <div key={sede.id} className="rounded-lg bg-slate-50 shadow-sm">
            <div
              className="flex cursor-pointer items-center justify-between border-b p-4"
              onClick={() => toggleSede(sede.id)}
            >
              <div>
                <h2 className="text-xl font-bold text-slate-800">{sede.nombre}</h2>
                <p className="text-sm text-slate-500">
                  {sede.edificios.length} edificio(s)
                </p>
              </div>
              <button className="p-1">
                {expandedSedes[sede.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            </div>

            {expandedSedes[sede.id] && (
              <div className="p-4">
                <div className="mb-4 relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Buscar edificios en esta sede..."
                    className="pl-10"
                    value={localSearches[sede.id] ?? ""}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => updateLocalSearch(sede.id, e.target.value)}
                  />
                </div>

                {filteredEdificios.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredEdificios.map((edificio) => {
                      const evaluaciones = evaluacionesPorCodigo[edificio.codigo] || [];
                      return (
                        <EvaluatedBuildingCard
                          key={edificio.id}
                          edificio={edificio}
                          evaluaciones={evaluaciones}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                    <h3 className="mb-2 text-lg font-medium">No se encontraron edificios</h3>
                    <p className="text-sm text-muted-foreground">
                      No hay edificios que coincidan con tu búsqueda en esta sede.
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

export function EvaluationListContainer({
  
  sedesConEvaluaciones,
}: {
  sedesConEvaluaciones: Sede[];
}) {
  return <EvaluationList sedesConEvaluaciones={sedesConEvaluaciones} />;
}

function EvaluationList({ sedesConEvaluaciones }: { sedesConEvaluaciones: Sede[] }) {
  const [expandedSedes, setExpandedSedes] = useState<Record<number, boolean>>({});
  const [localSearches, setLocalSearches] = useState<Record<number, string>>({});

  const toggleSede = (sedeId: number) => {
    setExpandedSedes((prev) => ({
      ...prev,
      [sedeId]: !prev[sedeId],
    }));
  };

  const updateLocalSearch = (sedeId: number, searchTerm: string) => {
    setLocalSearches((prev) => ({
      ...prev,
      [sedeId]: searchTerm,
    }));
  };

  const getFilteredEvaluaciones = (sede: Sede) => {
    const searchTerm = localSearches[sede.id] ?? "";

    if (!searchTerm.trim()) {
      return sede.edificios;
    }

    return sede.edificios.filter((edificio) => {
      const nombreMatch = edificio.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      const codigoMatch = edificio.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      return nombreMatch || codigoMatch;
    });
  };

  return (
    <div className="space-y-4">
      {sedesConEvaluaciones.map((sede) => {
        const filteredEvaluaciones = getFilteredEvaluaciones(sede);

        return (
          <div key={sede.id} className="rounded-lg bg-slate-50 shadow-sm">
            <div
              className="flex cursor-pointer items-center justify-between border-b p-4"
              onClick={() => toggleSede(sede.id)}
            >
              <div>
                <h2 className="text-xl font-bold text-slate-800">{sede.nombre}</h2>
                <p className="text-sm text-slate-500">
                  {sede.edificios.length} edificio(s)
                </p>
              </div>
              <button className="p-1">
                {expandedSedes[sede.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            </div>

            {expandedSedes[sede.id] && (
              <div className="p-4">
                <div className="mb-4 relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Buscar evaluaciones en este campus/centro académico..."
                    className="pl-10"
                    value={localSearches[sede.id] ?? ""}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => updateLocalSearch(sede.id, e.target.value)}
                  />
                </div>

                {filteredEvaluaciones.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredEvaluaciones.map((building) => (
                      <div key={building.id}>{building.nombre}</div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                    <h3 className="mb-2 text-lg font-medium">No se encontraron evaluaciones</h3>
                    <p className="text-sm text-muted-foreground">
                      No hay evaluaciones que coincidan con tu búsqueda en este campus/centro académico.
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
