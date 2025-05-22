// Este archivo contiene los tipos de datos para el sistema de evaluación de edificios
export interface Eje {
  id: number;
  eje: string;
  peso: number;
}

export interface Criterio {
  id: number;
  ejeId: number;
  criterio: string;
  peso: number;
  ejes_priorizacion_Id: number;
}

export interface Parametro {
  id: number;
  parametro: string;
  peso: number;
  criterios_priorizacion_Id: number;
}

// Interfaces para los objetos de evaluación
export interface ParametroSeleccionado {
  id: string;
  valor: number;
  puntaje: string;
  parametroTexto?: string;
}

export interface FormularioProyecto {
  informacionGeneral: {
    nombre: string;
    descripcion: string;
    tipoEdificacion: string;
    edificioSeleccionado: string;
  };
  edificacionExistente: {
    depreciacion: number;
    estadoComponentes: number;
    condicionFuncionalidad: number;
    totalPuntaje: string;
  } | null;
  configuracion: {
    ejes: Eje[];
    criterios: Criterio[];
    parametros: Parametro[];
  };
  evaluacion: Record<string, any>;
}
