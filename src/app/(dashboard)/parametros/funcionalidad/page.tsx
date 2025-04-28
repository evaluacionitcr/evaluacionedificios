"use client";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect, MouseEvent } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import {  } from "../funcionalidad/actions";

interface Funcionalidad {
  id: number;
  funcionalidad: string;
  puntuacion: number;
  descripcion: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface APIFuncionalidad {
    id: number;
    funcionalidad: string;
    puntuacion: number;
    descripcion: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface FuncionalidadResponse {
    success: boolean;
    data?: APIFuncionalidad[];
    error?: string;
}
export default function Page() {

    const [editRowIndex, setEditRowIndex] = useState<number | null>(null);
    const [tableData, setTableData] = useState<Funcionalidad[]>([]);
  

    const defaultData = [
        { id: 1, estado: "Estado 1", puntuacion: 0.0, descripcion: "" },
        { id: 2, estado: "Estado 2", puntuacion: 0.0, descripcion: "" },
        { id: 3, estado: "Estado 3", puntuacion: 0.0, descripcion: "" },
    ];

    const handleEditClick = (index: number) => {
        setEditRowIndex(index);
      };

      const handleInputChange = (
        index: number,
        field: keyof Omit<Funcionalidad, "id">,
        value: string | number,
      ) => {
        const updatedData = [...tableData];
        const currentRow = updatedData[index];
        if (currentRow) {
          updatedData[index] = {
            ...currentRow,
            [field]: value,
          };
          setTableData(updatedData);
        }
      };

    const handleSaveClick = (index: number) => {
        const row = tableData[index];
        if (!row) return;
    
        const data: Funcionalidad = {
          id: row.id,
          funcionalidad: row.funcionalidad,
          puntuacion: row.puntuacion,
          descripcion: row.descripcion,
        };
    
        updateComponente(data)
          .then((response) => {
            console.log("Response:", response);
            if (response.success) {
              console.log("Componente actualizado exitosamente");
              setEditRowIndex(null);
            } else {
              console.error("Error al actualizar componente");
            }
          })
          .catch((error) => {
            console.error("Error al actualizar componente:", error);
          });
      };
          
    const handleSubmit = () => {
        const newRow = {
            id: tableData.length + 1,
            estado: `Nuevo estado`,
            puntuacion: 0.0,
            descripcion: "",
        };
        setTableData((prevData) => [...prevData, newRow]);
    };
      
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/parametros">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5 text-primary" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-primary">Funcionalidad</h1>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6">
        <Card className="grid grid-cols-1 gap-6">
          <CardContent className="bg-white shadow-sm">
            <div className="overflow-x-auto p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/4">Estado</TableHead>
                    <TableHead className="w-1/4">Puntuación</TableHead>
                    <TableHead className="w-1/2">Descripción</TableHead>
                    <TableHead className="w-1/4">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="w-1/4">{row.estado}</TableCell>
                      <TableCell className="w-1/4">{row.puntuacion.toFixed(2)}</TableCell>
                      <TableCell className="w-1/2">{row.descripcion}</TableCell>
                      <TableCell className="w-1/4 text-center">
                        <Button
                          className="rounded bg-red-500 px-4 py-2 text-white"
                          
                        >
                          Eliminar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        <div className="mt-4 text-center">
          <Button className="rounded px-4 py-2 text-white" onClick={handleSubmit}>
            Agregar Componente
          </Button>
        </div>
      </div>
    </div>
  );
}