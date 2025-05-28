import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";

interface TotalScoreProps {
  puntajeDepreciacionTotal: number;
  puntajeComponentes: number;
  puntajeSeviciabilidad: number;
  puntajeTotalEdificio: number;
}

const TotalScoreTable: React.FC<TotalScoreProps> = ({
  puntajeDepreciacionTotal,
  puntajeComponentes,
  puntajeSeviciabilidad,
  puntajeTotalEdificio,
}) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center mb-8">Total del Edificio</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold text-center whitespace-nowrap bg-[#00205B] text-white w-[12%]">
              Rubro
            </TableHead>
            <TableHead className="font-semibold text-center whitespace-nowrap bg-[#00205B] text-white w-[12%]">
              Puntaje Priorizacion Relativo
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="text-center">
              Puntaje por depreciación del edificio 
            </TableCell>
            <TableCell className="text-center font-bold bg-yellow-100">
              {puntajeDepreciacionTotal}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-center">
              Puntaje por estado de los componentes y sistemas del edificio
            </TableCell>
            <TableCell className="text-center font-bold bg-yellow-100">
              {puntajeComponentes}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-center">
              Puntaje por Serviciabilidad
            </TableCell>
            <TableCell className="text-center font-bold bg-yellow-100">
              {puntajeSeviciabilidad}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="text-center font-bold">
              PUNTAJE TOTAL DEL EDIFICIO
            </TableCell>
            <TableCell className="text-center font-bold bg-yellow-100">
              {puntajeTotalEdificio}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default TotalScoreTable;