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

export interface ApiResponse {
  data: Evaluacion[];
  status: string;
  message?: string;
}

export interface Evaluacion {
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
