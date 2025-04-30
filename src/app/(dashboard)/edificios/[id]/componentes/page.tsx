"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ComponentesTabs from "~/components/edificios/componentes-tabs";
import type { DatosFijos } from "~/utils/consts";

interface ComponentesResponse {
  aceras: ComponenteDetalle | null;
  terrenos: ComponenteDetalle | null;
  zonasVerdes: ComponenteDetalle | null;
}

interface ComponenteDetalle {
  id: number;
  idConstruccion: number | null;
  codigoEdificio: string;
  sede: number | null;
  sedeNombre: string | null;
  esRenovacion: boolean | null;
  nombre: string;
  fechaConstruccion: number | null;
  numeroFinca: string | null;
  m2Construccion: number | null;
  valorDolarPorM2: string | null;
  valorColonPorM2: string | null;
  edad: number | null;
  vidaUtilHacienda: number | null;
  vidaUtilExperto: number | null;
  valorReposicion: string | null;
  depreciacionLinealAnual: string | null;
  valorActualRevaluado: string | null;
  anoDeRevaluacion: number | null;
  usoActual: string | null;
}

export default function ComponentesPage() {
  const params = useParams();
  const [datosFijos, setDatosFijos] = useState<DatosFijos | undefined>(undefined);
  const [componentesExistentes, setComponentesExistentes] = useState<{
    aceras: ComponenteDetalle | null;
    terrenos: ComponenteDetalle | null;
    zonasVerdes: ComponenteDetalle | null;
  }>({
    aceras: null,
    terrenos: null,
    zonasVerdes: null,
  });

  useEffect(() => {
    const id = params?.id;
    if (!id) return;

    const fetchData = async () => {
      try {
        const [datosResponse, componentesResponse] = await Promise.all([
          fetch(`/api/datosEdificio/${id.toString()}`),
          fetch(`/api/componentes/${id.toString()}`),
        ]);

        const datos: DatosFijos = await datosResponse.json();
        const componentes: ComponentesResponse = await componentesResponse.json();

        console.log("Datos del edificio:", datos);
        console.log("Componentes encontrados:", componentes);

        if (datosResponse.ok) {
          setDatosFijos(datos);
        }

        if (componentesResponse.ok) {
          setComponentesExistentes({
            aceras: componentes.aceras ?? null,
            terrenos: componentes.terrenos ?? null,
            zonasVerdes: componentes.zonasVerdes ?? null,
          });
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    void fetchData();
  }, [params?.id]);

  if (!params) {
    return <div>Error: Parámetros no disponibles</div>;
  }

  const id = params.id;
  if (!id) {
    return <div>Error: No se encontró el ID del edificio</div>;
  }

  return (
    <div className="space-y-6">
      <ComponentesTabs 
        codigoEdificio={id.toString()} 
        datosFijos={datosFijos} 
        componentesExistentes={componentesExistentes}
      />
    </div>
  );
}
