import React from 'react';

interface BuildingInfoProps {
  edificioData: {
    codigoEdificio?: string;
    nombre?: string;
    usoActualDescripcion?: string;
    m2Construccion?: number;
    sedeNombre?: string;
  } | null;
}

const BuildingInfoSection: React.FC<BuildingInfoProps> = ({ edificioData }) => {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="edificio" className="text-base font-medium text-gray-700">Edificio</label>
          <input
            id="edificio"
            placeholder="Ej: Edificio U-11"
            value={edificioData?.nombre ??""}
            readOnly
            className="w-full h-11 px-4 border border-gray-300 rounded-md bg-gray-50"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="codigo" className="text-base font-medium text-gray-700">Código</label>
          <input
            id="codigo"
            value={edificioData?.codigoEdificio ??""}
            readOnly
            className="w-full h-11 px-4 border border-gray-300 rounded-md bg-gray-50"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="campus" className="text-base font-medium text-gray-700">Campus Tecnológico / Centro Académico</label>
        <input
          id="campus"
          value={edificioData?.sedeNombre ??""}
          readOnly
          className="w-full h-11 px-4 border border-gray-300 rounded-md bg-gray-50"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="area" className="text-base font-medium text-gray-700">Área (m²)</label>
          <input
            id="area"
            value={edificioData?.m2Construccion ??""}
            readOnly
            className="w-full h-11 px-4 border border-gray-300 rounded-md bg-gray-50"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="uso" className="text-base font-medium text-gray-700">Uso</label>
          <input
            id="uso"
            value={edificioData?.usoActualDescripcion ??""}
            readOnly
            className="w-full h-11 px-4 border border-gray-300 rounded-md bg-gray-50"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="descripcion" className="text-base font-medium text-gray-700">Descripción</label>
        <textarea
          id="descripcion"
          placeholder="Ingrese la descripción detallada del edificio"
          className="w-full min-h-[200px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>
    </div>
  );
};

export default BuildingInfoSection;