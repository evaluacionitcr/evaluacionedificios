import React from 'react';

interface EstadoConservacion {
  id: number;
  estado_conservacion: string;
  condiciones_fisicas: string;
  clasificacion: string;
  coef_depreciacion: number;
}

interface DepreciationProps {
  edadEdificio: string;
  setEdadEdificio: (value: string) => void;
  vidaUtil: string;
  setVidaUtil: (value: string) => void;
  estadoSeleccionado: number;
  setEstadoSeleccionado: (value: number) => void;
  escalaDepreciacion: number;
  edadEdificioRemodelacion: string;
  setEdadEdificioRemodelacion: (value: string) => void;
  vidaUtilRemodelacion: string;
  setVidaUtilRemodelacion: (value: string) => void;
  estadoSeleccionadoRemodelacion: number;
  setEstadoSeleccionadoRemodelacion: (value: number) => void;
  porcentajeRemodelacion: number;
  setPorcentajeRemodelacion: (value: number) => void;
  escalaDepreciacionRemodelacion: number;
  puntajeDepreciacionTotal: number;
  estadosConservacion: EstadoConservacion[];
}

const DepreciationSection: React.FC<DepreciationProps> = ({
  edadEdificio,
  setEdadEdificio,
  vidaUtil,
  setVidaUtil,
  estadoSeleccionado,
  setEstadoSeleccionado,
  escalaDepreciacion,
  edadEdificioRemodelacion,
  setEdadEdificioRemodelacion,
  vidaUtilRemodelacion,
  setVidaUtilRemodelacion,
  estadoSeleccionadoRemodelacion,
  setEstadoSeleccionadoRemodelacion,
  porcentajeRemodelacion,
  setPorcentajeRemodelacion,
  escalaDepreciacionRemodelacion,
  puntajeDepreciacionTotal,
  estadosConservacion,
}) => {
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
              value={edadEdificio}
              onChange={(e) => setEdadEdificio(e.target.value)}
              placeholder="Cargar la edad del edificio"
              className="w-full h-11 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="vida-util-principal" className="text-base font-medium">Vida Útil Esperada</label>
            <input
              id="vida-util-principal"
              value={vidaUtil}
              onChange={(e) => setVidaUtil(e.target.value)}
              placeholder="Cargar la vida útil esperada"
              className="w-full h-11 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="estado-conservacion-principal" className="text-base font-medium">Estado de Conservación</label>
            <select
              value={estadoSeleccionado}
              onChange={(e) => setEstadoSeleccionado(parseFloat(e.target.value))}
              className="w-full h-11 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {estadosConservacion.map((estado) => (
                <option key={estado.id} value={estado.coef_depreciacion}>
                  {estado.clasificacion}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="escala-depreciacion-principal" className="text-base font-medium">Escala de depreciación</label>
            <input
              id="escala-depreciacion-principal"
              value={escalaDepreciacion}
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
              value={edadEdificioRemodelacion}
              onChange={(e) => setEdadEdificioRemodelacion(e.target.value)}
              placeholder="Cargar la edad de la remodelación"
              className="w-full h-11 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="vida-util-remodela" className="text-base font-medium">Vida Útil Esperada</label>
            <input
              id="vida-util-remodela"
              value={vidaUtilRemodelacion}
              onChange={(e) => setVidaUtilRemodelacion(e.target.value)}
              placeholder="Cargar la vida útil esperada"
              className="w-full h-11 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="estado-conservacion-remodela" className="text-base font-medium">Estado de Conservación</label>
            <select
              value={estadoSeleccionadoRemodelacion}
              onChange={(e) => setEstadoSeleccionadoRemodelacion(parseFloat(e.target.value))}
              className="w-full h-11 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {estadosConservacion.map((estado) => (
                <option key={estado.id} value={estado.coef_depreciacion}>
                  {estado.clasificacion}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="porcentaje-remodelacion" className="text-base font-medium">Porcentaje de Remodelación/Ampliación</label>
            <div className="relative">
              <input
                id="porcentaje-remodelacion"
                value={porcentajeRemodelacion}
                min={0}
                max={100}
                onChange={(e) => setPorcentajeRemodelacion(parseFloat(e.target.value))}
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
              value={escalaDepreciacionRemodelacion}
              readOnly
              placeholder="Cargar la escala de depreciación"
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
            value={puntajeDepreciacionTotal}
            readOnly
            className="w-full md:max-w-[200px] h-11 font-bold text-center"
          />
        </div>
      </div>
    </div>
  );
};

export default DepreciationSection;