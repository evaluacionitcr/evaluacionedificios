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
        console.log(`Iniciando peticiones para edificio con ID: ${id.toString()}`);
        
        // Primera petición: datos del edificio
        const datosResponse = await fetch(`/api/datosEdificio/${id.toString()}`);
        
        if (!datosResponse.ok) {
          console.error(`Error en la petición de datos del edificio. Status: ${datosResponse.status}`);
          throw new Error(`Error al obtener datos del edificio: ${datosResponse.statusText}`);
        }
        
        const datosJson = await datosResponse.json();
        console.log("Datos del edificio recibidos:", datosJson);
        
        // Segunda petición: componentes
        const componentesResponse = await fetch(`/api/componentes/${id.toString()}`);
        
        if (!componentesResponse.ok) {
          console.error(`Error en la petición de componentes. Status: ${componentesResponse.status}`);
          throw new Error(`Error al obtener componentes: ${componentesResponse.statusText}`);
        }
        
        const componentesJson = await componentesResponse.json();
        console.log("Componentes recibidos:", componentesJson);

        // Validación detallada de la estructura de datos
        if (!isDatosFijos(datosJson)) {
          console.error("Estructura de DatosFijos inválida:", datosJson);
          console.error("Propiedades esperadas:", ["id", "codigoEdificio", "usoActualId", "usoActualDescripcion", "noFinca", "noFincaId", "fechaConstruccion"]);
          console.error("Propiedades recibidas:", Object.keys(datosJson));
          throw new Error('Datos del edificio en formato inválido');
        }

        // Validación detallada de componentes
        if (!isComponentesResponse(componentesJson)) {
          console.error("Estructura de Componentes inválida:", componentesJson);
          throw new Error('Componentes en formato inválido');
        }

        setDatosFijos(datosJson);
        setComponentesExistentes({
          aceras: componentesJson.aceras ?? null,
          terrenos: componentesJson.terrenos ?? null,
          zonasVerdes: componentesJson.zonasVerdes ?? null,
        });
      } catch (error) {
        console.error("Error detallado al cargar datos:", error);
        // Alertar al usuario sobre el error
        alert(`Error al cargar datos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      }
    };

    void fetchData();
  }, [params?.id]);

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
