import React from 'react';

interface EstadoConservacion {
  id: number;
  estado_conservacion: string;
  condiciones_fisicas: string;
  clasificacion: string;
  coef_depreciacion: number;
}

interface DepreciationProps {
  depreciacionData: {
    puntajeDepreciacionTotal: number;
    principal: {
      edad: string;
      vidaUtil: string;
      estadoConservacionCoef: number;
      escalaDepreciacion: number;
    };
    remodelacion: {
      edad: string;
      vidaUtil: string;
      estadoConservacionCoef: number;
      porcentajeRemodelacion: number;
      escalaDepreciacion: number;
      porcentaje : number;
    };
    estadosConservacion: EstadoConservacion[];
  } | null;
}

const DepreciationSection: React.FC<DepreciationProps> = ({depreciacionData}) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center mb-8">Puntaje por depreciación del edificio</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        <div className="bg-[#00205B] text-white text-center py-3 font-semibold">Edificación Principal</div>
        <div className="bg-[#00205B] text-white text-center py-3 font-semibold">Remodelación</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        <div className="border-r border-gray-200 p-4 space-y-4">
          <div className="space-y-2">
            <label htmlFor="edad-edificio" className="text-base font-medium">Edad de Edificio</label>
            <input
              id="edad-edificio"
              type="number"
              value={depreciacionData?.principal.edad ?? ""}
              placeholder="Cargar la edad del edificio"
              readOnly
              className="w-full h-11 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="vida-util-principal" className="text-base font-medium">Vida Útil Esperada</label>
            <input
              id="vida-util-principal"
              value={depreciacionData?.principal.vidaUtil ?? ""}
              readOnly
              placeholder="Cargar la vida útil esperada"
              className="w-full h-11 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="estado-conservacion-principal" className="text-base font-medium">Estado de Conservación</label>
            <input
              value={depreciacionData?.principal.estadoConservacionCoef ?? ""}
              readOnly
              className="w-full h-11 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="escala-depreciacion-principal" className="text-base font-medium">Escala de depreciación</label>
            <input
              id="escala-depreciacion-principal"
              value={depreciacionData?.principal.escalaDepreciacion ?? ""}
              readOnly
              placeholder="Cargar la escala de depreciación"
              className="w-full h-11 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <label htmlFor="edad-remodela" className="text-base font-medium">Edad de Remodelación</label>
            <input
              id="edad-remodela"
              type="number"
              value={depreciacionData?.remodelacion.edad ?? ""}
              readOnly
              placeholder="Cargar la edad de la remodelación"
              className="w-full h-11 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="vida-util-remodela" className="text-base font-medium">Vida Útil Esperada</label>
            <input
              id="vida-util-remodela"
              value={depreciacionData?.remodelacion.vidaUtil ?? ""}
              readOnly
              placeholder="Cargar la vida útil esperada"
              className="w-full h-11 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="estado-conservacion-remodela" className="text-base font-medium">Estado de Conservación</label>
            <input
              value={depreciacionData?.remodelacion.estadoConservacionCoef ?? ""}
              readOnly
              className="w-full h-11 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="porcentaje-remodelacion" className="text-base font-medium">Porcentaje de Remodelación/Ampliación</label>
            <div className="relative">
              <input
                id="porcentaje-remodelacion"
                value={depreciacionData?.remodelacion.porcentaje ?? ""}
                readOnly
                min={0}
                max={100}
                type="number"
                className="w-full h-11 px-4 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2">%</span>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="escala-depreciacion-remodela" className="text-base font-medium">Escala de depreciación Remodelación/Ampliación</label>
            <input
              id="escala-depreciacion-remodela"
              value={depreciacionData?.remodelacion.escalaDepreciacion ?? ""}
              readOnly
              placeholder=""
              className="w-full h-11 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="p-4 bg-yellow-100 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <label htmlFor="puntaje-total" className="text-base font-bold">PUNTAJE DE DEPRECIACIÓN TOTAL</label>
          <input
            id="puntaje-total"
            value={depreciacionData?.puntajeDepreciacionTotal ?? ""}
            readOnly
            className="w-full md:max-w-[200px] h-11 font-bold text-center"
          />
        </div>
      </div>
    </div>
  );
};

export default DepreciationSection;