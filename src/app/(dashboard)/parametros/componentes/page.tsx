"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { ArrowLeft, Building, Calendar, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

export default function Page() {
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [tableData, setTableData] = useState([
    {
      componente: "Cimientos",
      peso: 2.5,
      elementos: "Placa corrida, placa aislada o losa de fundación; revisión de asentamientos diferenciales, agrietamiento o socavación",
    },
    {
      componente: "Componente 2",
      peso: 20.0,
      elementos: "Elemento 3, Elemento 4",
    },
  ]);

  const handleEditClick = (index) => {
    setEditRowIndex(index);
  };

  const handleInputChange = (index, field, value) => {
    const updatedData = [...tableData];
    updatedData[index][field] = value;
    setTableData(updatedData);
  };

  const handleSaveClick = (index) => {
    console.log("Saved row:", tableData[index]);
    setEditRowIndex(null);
  };
  

  const calculateTotalWeight = () => {
    return tableData.reduce((total, row) => total + (parseFloat(row.peso) || 0), 0);
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
          <h1 className="text-2xl font-bold text-primary">Componentes</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-white shadow-sm">
          <CardContent>
            <div className="overflow-x-auto p-4">
              <Table className="table-fixed">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/4">Componente o Sistema</TableHead>
                    <TableHead className="w-1/4">Peso del componente o sistema</TableHead>
                    <TableHead className="w-1/2">Elementos a valorar del componente o sistema</TableHead>
                    <TableHead className="w-1/4">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="w-1/4">
                          {editRowIndex === index ? (
                            <input
                              type="text"
                              value={row.componente}
                              onChange={(e) =>
                                handleInputChange(index, "componente", e.target.value)
                              }
                              className="border rounded px-2 py-1 w-full" // 'w-full' asegura que el input ocupe todo el ancho disponible sin cambiar de tamaño
                            />
                          ) : (
                            row.componente
                          )}
                        </TableCell>
                      
                        <TableCell className="w-1/4">
                          {editRowIndex === index ? (
                            <input
                              type="number"
                              value={row.peso}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                handleInputChange(index, "peso", isNaN(value) ? "" : value);
                              }}
                              className="border rounded px-2 py-1 w-full"
                            />
                          ) : (
                            row.peso
                          )}
                        </TableCell>
                      
                        <TableCell className="w-1/2">
                          {editRowIndex === index ? (
                            <input
                              type="text"
                              value={row.elementos}
                              onChange={(e) =>
                                handleInputChange(index, "elementos", e.target.value)
                              }
                              className="border rounded px-2 py-1 w-full"
                            />
                          ) : (
                            row.elementos
                          )}
                        </TableCell>
                        <TableCell className="w-1/4 text-center justify-center items-center space-x-2">
                          {editRowIndex === index ? (
                            <Button
                              className="text-white px-4 py-2 rounded bg-blue-500"
                              onClick={() => handleSaveClick(index)} // Aquí pasamos el índice correctamente
                            >
                              Guardar
                            </Button>
                          ) : (
                            <Button
                              className="text-white px-4 py-2 rounded "
                              onClick={() => handleEditClick(index)}
                            >
                              Editar
                            </Button>
                          )}
                          <Button
                            className="text-white px-4 py-2 rounded bg-red-500"
                            onClick={() => {
                              const updatedData = tableData.filter((_, i) => i !== index);
                              setTableData(updatedData);
                            }}
                          >
                            Eliminar
                          </Button>
                        </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell className="w-1/4">Total</TableCell>
                    <TableCell className="w-1/4">{calculateTotalWeight()}</TableCell>
                    <TableCell className="w-1/2"></TableCell>
                    <TableCell className="w-1/4"></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        <div className="text-center mt-4">
          <Button
            className="text-white px-4 py-2 rounded"
            onClick={() => {
              setTableData([
                ...tableData,
                { componente: "Nuevo Componente", peso: 0.0, elementos: "" },
              ]);
            }}
          >
            Agregar Fila
          </Button>
        </div>
      </div>
    </div>
  );
}
