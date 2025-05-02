"use client";

import { useState } from "react";
import BuildingCard from "./building-card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input"; 
import { ChevronDown, ChevronUp, Search } from "lucide-react";

// Definimos la tipificación para hacer el código más seguro
interface Edificio {
  id: number;
  nombre: string;
  codigo: string;
  // Otros campos que pueda tener tu objeto building
}

interface Sede {
  id: number;
  nombre: string;
  edificios: Edificio[];
}

// Esta función es el componente que se renderiza en el servidor
export default function BuildingListContainer({
  sedesConEdificios,
}: {
  sedesConEdificios: Sede[];
}) {
  return <BuildingList sedesConEdificios={sedesConEdificios} />;
}

// Este es el componente client que maneja el estado
function BuildingList({ sedesConEdificios }: { sedesConEdificios: Sede[] }) {
  // Estado para rastrear qué sedes están expandidas
  const [expandedSedes, setExpandedSedes] = useState<Record<number, boolean>>(
    {},
  );
  
  // Estado para búsquedas locales dentro de cada sede
  const [localSearches, setLocalSearches] = useState<Record<number, string>>({});

  // Función para alternar la expansión de una sede
  const toggleSede = (sedeId: number) => {
    setExpandedSedes((prev) => ({
      ...prev,
      [sedeId]: !prev[sedeId],
    }));
  };
  
  // Función para actualizar la búsqueda local de una sede
  const updateLocalSearch = (sedeId: number, searchTerm: string) => {
    setLocalSearches((prev) => ({
      ...prev,
      [sedeId]: searchTerm,
    }));
  };
  
  // Función para filtrar edificios por búsqueda local
  const getFilteredEdificios = (sede: Sede) => {
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
      {sedesConEdificios.map((sede) => {
        const filteredEdificios = getFilteredEdificios(sede);
        
        return (
          <div key={sede.id} className="rounded-lg bg-slate-50 shadow-sm">
            <div
              className="flex cursor-pointer items-center justify-between border-b p-4"
              onClick={() => toggleSede(sede.id)}
            >
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {sede.nombre}
                </h2>
                <p className="text-sm text-slate-500">
                  {sede.edificios.length} edificio
                  {sede.edificios.length !== 1 ? "s" : ""}
                </p>
              </div>
              <Button variant="ghost" size="sm" className="p-1">
                {expandedSedes[sede.id] ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </Button>
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
                    {filteredEdificios.map((building) => (
                      <BuildingCard key={building.id} building={building} />
                    ))}
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
