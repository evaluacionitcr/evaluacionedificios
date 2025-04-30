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

        if (!datosResponse.ok || !componentesResponse.ok) {
          throw new Error('Error en la respuesta del servidor');
        }

        const datosJson = await datosResponse.json();
        const componentesJson = await componentesResponse.json();

        // Type validation for datos
        if (!isDatosFijos(datosJson)) {
          throw new Error('Datos del edificio en formato inválido');
        }

        // Type validation for componentes
        if (!isComponentesResponse(componentesJson)) {
          throw new Error('Componentes en formato inválido');
        }

        console.log("Datos del edificio:", datosJson);
        console.log("Componentes encontrados:", componentesJson);

        setDatosFijos(datosJson);
        setComponentesExistentes({
          aceras: componentesJson.aceras ?? null,
          terrenos: componentesJson.terrenos ?? null,
          zonasVerdes: componentesJson.zonasVerdes ?? null,
        });
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    void fetchData();
  }, [params?.id]);

  // Type guards
  function isDatosFijos(data: unknown): data is DatosFijos {
    return (
      typeof data === 'object' &&
      data !== null &&
      'id' in data &&
      'codigoEdificio' in data &&
      'usoActualId' in data &&
      'usoActualDescripcion' in data &&
      'noFinca' in data &&
      'noFincaId' in data &&
      'fechaConstruccion' in data
    );
  }

  function isComponenteDetalle(data: unknown): data is ComponenteDetalle {
    return (
      typeof data === 'object' &&
      data !== null &&
      'id' in data &&
      'codigoEdificio' in data &&
      'nombre' in data
    );
  }

  function isComponentesResponse(data: unknown): data is ComponentesResponse {
    return (
      typeof data === 'object' &&
      data !== null &&
      'aceras' in data &&
      'terrenos' in data &&
      'zonasVerdes' in data &&
      (data.aceras === null || isComponenteDetalle(data.aceras)) &&
      (data.terrenos === null || isComponenteDetalle(data.terrenos)) &&
      (data.zonasVerdes === null || isComponenteDetalle(data.zonasVerdes))
    );
  }

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
