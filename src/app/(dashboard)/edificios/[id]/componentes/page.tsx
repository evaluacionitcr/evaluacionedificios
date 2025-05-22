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
  usoActual: number | null; // Changed from string to number
}

// Type guards con validación mejorada
function isDatosFijos(data: unknown): data is DatosFijos {
  if (typeof data !== 'object' || data === null) {
    console.error("data no es un objeto", data);
    return false;
  }
  
  const requiredProps = ['id', 'codigoEdificio', 'usoActualId', 'usoActualDescripcion', 'noFinca', 'noFincaId', 'fechaConstruccion'];
  const missingProps = requiredProps.filter(prop => !(prop in data));
  
  if (missingProps.length > 0) {
    console.error(`Faltan propiedades requeridas en DatosFijos: ${missingProps.join(", ")}`, data);
    return false;
  }
  
  return true;
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

export default function ComponentesPage() {
  const params = useParams();
  const [datosFijos, setDatosFijos] = useState<DatosFijos | undefined>(undefined);
  const [componentesExistentes, setComponentesExistentes] = useState<ComponentesResponse>({
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
          fetch(`/api/componentes/${id.toString()}`)
        ]);
        
        if (!datosResponse.ok) {
          throw new Error(`Error al obtener datos del edificio: ${datosResponse.statusText}`);
        }
        
        if (!componentesResponse.ok) {
          throw new Error(`Error al obtener componentes: ${componentesResponse.statusText}`);
        }

        const datosJson: unknown = await datosResponse.json();
        const componentesJson: unknown = await componentesResponse.json();

        if (!isDatosFijos(datosJson)) {
          throw new Error('Datos del edificio en formato inválido');
        }

        if (!isComponentesResponse(componentesJson)) {
          throw new Error('Componentes en formato inválido');
        }

        setDatosFijos(datosJson);
        setComponentesExistentes(componentesJson);
      } catch (error) {
        console.error("Error detallado al cargar datos:", error);
        alert(`Error al cargar datos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
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
        codigoEdificio={datosFijos?.codigoEdificio ?? ''} 
        datosFijos={datosFijos} 
        componentesExistentes={componentesExistentes}
      />
    </div>
  );
}
