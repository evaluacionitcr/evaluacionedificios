import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";

interface Componente {
  id: number;
  componente: string;
  peso: number;
  necesidadIntervencion: number;
  existencia: string;
  pesoEvaluado?: number;
  puntaje?: number;
  elementos: string;
}

interface ComponentsTableProps {
  componentes: Componente[];
  totalPeso: number;
  puntajeComponentes: number;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
  handleExistenciaChange: (index: number, value: string) => void;
  calcularPesoEvaluacion: (componente: Componente) => string;
  calcularPuntajeComponentes: (componente: Componente) => string;
  getInputColor: (value: number, existencia: string) => string;
  readOnly?: boolean; // Added readOnly prop
}

const ComponentsTable: React.FC<ComponentsTableProps> = ({
  componentes,
  totalPeso,
  puntajeComponentes,
  handleChange,
  handleExistenciaChange,
  calcularPesoEvaluacion,
  calcularPuntajeComponentes,
  getInputColor,
}) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center mb-8">Puntaje del estado de los componentes y sistemas del edificio</h1>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold text-center whitespace-nowrap bg-[#00205B] text-white w-[12%]">
              Componente o Sistema
            </TableHead>
            <TableHead className="font-semibold text-center whitespace-nowrap bg-[#00205B] text-white w-[8%]">
              Existencia
            </TableHead>
            <TableHead className="font-semibold text-center whitespace-nowrap bg-[#00205B] text-white">
              Peso [P]
            </TableHead>
            <TableHead className="font-semibold text-center bg-[#00205B] text-white w-[40%]">
              Elementos a valorar del componente o sistema
            </TableHead>
            <TableHead
              className="font-semibold text-center whitespace-nowrap bg-[#00205B] text-white w-[24%]"
              colSpan={3}
            >
              Necesidad de intervención (N)
            </TableHead>
            <TableHead className="font-semibold text-center bg-yellow-100 whitespace-nowrap w-[8%]">
              Puntaje
            </TableHead>
          </TableRow>
          <TableRow>
            <TableHead className="bg-gray-100"></TableHead>
            <TableHead className="bg-gray-100"></TableHead>
            <TableHead className="bg-gray-100"></TableHead>
            <TableHead className="bg-gray-100"></TableHead>
            <TableHead className="font-semibold text-center whitespace-nowrap bg-green-100">
              Bajo (0-33)%
            </TableHead>
            <TableHead className="font-semibold text-center whitespace-nowrap bg-yellow-100">
              Medio (33-66)%
            </TableHead>
            <TableHead className="font-semibold text-center whitespace-nowrap bg-red-100">
              Alto (66-100)%
            </TableHead>
            <TableHead className="bg-yellow-100"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {componentes.map((componente, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{componente.componente}</TableCell>
              <TableCell className="text-center">
                <RadioGroup
                  value={componente.existencia}
                  onValueChange={(value) => handleExistenciaChange(index, value)}
                  className="flex justify-center space-x-2"
                >
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem id={`${componente.componente}-si`} value="si" />
                    <Label htmlFor={`${componente.componente}-si`}>Sí</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem id={`${componente.componente}-no`} value="no" />
                    <Label htmlFor={`${componente.componente}-no`}>No</Label>
                  </div>
                </RadioGroup>
              </TableCell>
              <TableCell>
                <div className="relative flex items-center">
                  <Input value={calcularPesoEvaluacion(componente)} readOnly className="text-right w-20 mx-auto pr-8" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                </div>
              </TableCell>
              <TableCell className="text-sm">
                {componente.elementos}
              </TableCell>
              <TableCell colSpan={3} className="text-center">
                <div className="relative flex items-center justify-center">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={componente.necesidadIntervencion}
                    readOnly
                    onChange={(e) => handleChange(e, index)}
                    
                    className={`mx-auto pr-2 ${getInputColor(componente.necesidadIntervencion, componente.existencia)}`}
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                </div>
              </TableCell>
              <TableCell className="text-center font-bold bg-yellow-100">
                {calcularPuntajeComponentes(componente)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <tfoot>
          <TableRow>
            <TableCell className="font-bold text-center" colSpan={2}>Total</TableCell>
            <TableCell className="font-bold text-center">
              {totalPeso.toFixed(2)}%
            </TableCell>
            <TableCell colSpan={4}></TableCell>
            <TableCell className="font-bold text-center bg-yellow-100">
              {puntajeComponentes}
            </TableCell>
          </TableRow>
        </tfoot>
      </Table>
    </div>
  );
};

export default ComponentsTable;