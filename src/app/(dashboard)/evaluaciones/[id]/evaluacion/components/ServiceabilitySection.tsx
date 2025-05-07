import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";

interface Funcionalidad {
  id: number;
  Estado: string;
  Puntuacion: number;
  Descripcion: string;
}

interface Normativa {
  id: number;
  Estado: string;
  Puntuacion: number;
  Descripcion: string;
}

interface ServiceabilityProps {
  funcionalidades: Funcionalidad[];
  normativas: Normativa[];
  serviceabilityData: {
    funcionalidadId: number;
    normativaId: number;
    puntajeServiciabilidad: number;
  } | null;
}

const ServiceabilitySection: React.FC<ServiceabilityProps> = ({ 
  funcionalidades,
  normativas,
  serviceabilityData }) => {

    const [funcionalidadSeleccionada, setFuncionalidadSeleccionada] = useState<number | null>(null);
    const [normativaSeleccionada, setNormativaSeleccionada] = useState<number | null>(null);

    useEffect(() => {
      if (serviceabilityData) {
        setFuncionalidadSeleccionada(serviceabilityData.funcionalidadId);
        setNormativaSeleccionada(serviceabilityData.normativaId);
      }
    }, [serviceabilityData]);

    console.log("funcionalidades", serviceabilityData?.funcionalidadId );
    console.log("normativas", normativas);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center mb-8">Puntaje por serviciabilidad</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold text-center whitespace-nowrap bg-[#00205B] text-white w-[12%]">
              Funcionalidad
            </TableHead>
            <TableHead className="font-semibold text-center whitespace-nowrap bg-[#00205B] text-white w-[12%]">
              Normativa
            </TableHead>
            <TableHead className="font-semibold text-center whitespace-nowrap bg-[#00205B] text-white w-[12%]">
              Puntaje Total
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="text-center">
            
                <select
                  value={funcionalidadSeleccionada ?? ""}
                  disabled
                  className="w-full h-11 px-4 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                >
                  <option value="">Seleccione una funcionalidad</option>
                  {funcionalidades.map((funcionalidad) => (
                    <option key={funcionalidad.id} value={funcionalidad.id}>
                      {funcionalidad.Estado}
                    </option>
                  ))}
                </select>
           
            </TableCell>
            <TableCell className="text-center">
      
                <select
                  value={normativaSeleccionada ?? ""}
                  disabled
                  className="w-full h-11 px-4 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                >
                  <option value="">Seleccione una normativa</option>
                  {normativas.map((normativa) => (
                    <option key={normativa.id} value={normativa.id}>
                      {normativa.Estado}
                    </option>
                  ))}
                </select>
            
            </TableCell>
            <TableCell className="text-center font-bold bg-yellow-100">
              {serviceabilityData?.puntajeServiciabilidad}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default ServiceabilitySection;