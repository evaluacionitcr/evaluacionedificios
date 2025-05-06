import React from 'react';
import { Table, TableBody, TableCell, TableRow } from "~/components/ui/table";

interface Comentarios {
  funcionalidad: string;
  normativa: string;
  componentesCriticos: string;
  mejorasRequeridas: string;
}

interface CommentsSectionProps {
  comentarios: Comentarios;
  handleComentarioChange: (field: keyof Comentarios, value: string) => void;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  comentarios,
  handleComentarioChange,
}) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center mb-8">Comentarios:</h1>
      
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-semibold text-center whitespace-nowrap text-black w-[2%]">
              Funcionalidad 
            </TableCell>
            <TableCell className="font-semibold text-center whitespace-nowrap text-black w-[50%]">
              <textarea 
                value={comentarios.funcionalidad}
                onChange={(e) => handleComentarioChange('funcionalidad', e.target.value)}
                className="w-full h-20 px-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" 
                placeholder="Ingrese los elementos a valorar"
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold text-center whitespace-nowrap text-black w-[2%]">
              Normativa 
            </TableCell>
            <TableCell className="font-semibold text-center whitespace-nowrap text-black w-[50%]">
              <textarea 
                value={comentarios.normativa}
                onChange={(e) => handleComentarioChange('normativa', e.target.value)}
                className="w-full h-20 px-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" 
                placeholder="Ingrese los elementos a valorar"
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold text-center whitespace-nowrap text-black w-[2%]">
              Componentes Críticos 
            </TableCell>
            <TableCell className="font-semibold text-center whitespace-nowrap text-black w-[50%]">
              <textarea 
                value={comentarios.componentesCriticos}
                onChange={(e) => handleComentarioChange('componentesCriticos', e.target.value)}
                className="w-full h-20 px-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" 
                placeholder="Ingrese los elementos a valorar"
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold text-center whitespace-nowrap text-black w-[2%]">
              Mejoras Requeridas
            </TableCell>
            <TableCell className="font-semibold text-center whitespace-nowrap text-black w-[50%]">
              <textarea 
                value={comentarios.mejorasRequeridas}
                onChange={(e) => handleComentarioChange('mejorasRequeridas', e.target.value)}
                className="w-full h-20 px-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" 
                placeholder="Ingrese los elementos a valorar"
              />
            </TableCell>
          </TableRow>
          
        </TableBody>
      </Table>
    </div>
  );
};

export default CommentsSection;