// building-list.tsx
"use client";

import { useState } from "react";
import BuildingCard from "./building-card";
import { Button } from "~/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

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

  // Función para alternar la expansión de una sede
  const toggleSede = (sedeId: number) => {
    setExpandedSedes((prev) => ({
      ...prev,
      [sedeId]: !prev[sedeId],
    }));
  };

  return (
    <div className="space-y-4">
      {sedesConEdificios.map((sede) => (
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
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sede.edificios.map((building) => (
                  <BuildingCard key={building.id} building={building} />
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
