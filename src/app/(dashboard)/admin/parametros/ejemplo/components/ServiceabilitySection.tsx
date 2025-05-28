import React from 'react';
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
  funcionalidadSeleccionada: string;
  setFuncionalidadSeleccionada: (value: string) => void;
  normativaSeleccionada: string;
  setNormativaSeleccionada: (value: string) => void;
  puntajeSeviciabilidad: number;
}

const ServiceabilitySection: React.FC<ServiceabilityProps> = ({
  funcionalidades,
  normativas,
  funcionalidadSeleccionada,
  setFuncionalidadSeleccionada,
  normativaSeleccionada,
  setNormativaSeleccionada,
  puntajeSeviciabilidad,
}) => {
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
                value={funcionalidadSeleccionada}
                onChange={(e) => setFuncionalidadSeleccionada(e.target.value)}
                className="w-full h-11 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {funcionalidades.map((funcionalidad) => (
                  <option key={funcionalidad.id} value={funcionalidad.id}>
                    {funcionalidad.Estado}
                  </option>
                ))}
              </select>
            </TableCell>
            <TableCell className="text-center">
              <select
                value={normativaSeleccionada}
                onChange={(e) => setNormativaSeleccionada(e.target.value)}
                className="w-full h-11 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {normativas.map((normativa) => (
                  <option key={normativa.id} value={normativa.id}>
                    {normativa.Estado}
                  </option>
                ))}
              </select>
            </TableCell>
            <TableCell className="text-center font-bold bg-yellow-100">
              {puntajeSeviciabilidad.toFixed(2)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default ServiceabilitySection;