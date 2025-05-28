"use client";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { getComponentes, createComponente, updateComponente, deleteComponente } from "./actions";

interface Componente {
  id: number;
  componente: string;
  peso: number;
  elementos: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface APIComponente {
  id: number;
  componente: string;
  peso: string;
  elementos: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ComponenteResponse {
  success: boolean;
  data?: APIComponente[];
  error?: string;
}

export default function Page() {
  const [editRowIndex, setEditRowIndex] = useState<number | null>(null);
  const [tableData, setTableData] = useState<Componente[]>([]);

  const handleEditClick = (index: number) => {
    setEditRowIndex(index);
  };

  const handleInputChange = (
    index: number,
    field: keyof Omit<Componente, "id">,
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

    const data: Componente = {
      id: row.id,
      componente: row.componente,
      peso: row.peso,
      elementos: row.elementos,
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

  const handleDeleteClick = (id: number) => {
    deleteComponente(id)
      .then((response) => {
        if (response.success) {
          console.log("Componente eliminado exitosamente");
          setTableData((prevData) => prevData.filter((row) => row.id !== id));
        } else {
          console.error("Error al eliminar componente");
        }
      })
      .catch((error) => {
        console.error("Error al eliminar componente:", error);
      });
  };

  const calculateTotalWeight = (): number => {
    return tableData.reduce((total, row) => total + (row.peso || 0), 0);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newRow: Omit<Componente, "id"> = {
      componente: "Nuevo Componente",
      peso: 0,
      elementos: "Nuevos elementos",
    };

    try {
      const response = await createComponente(newRow);
      if (response.success && response.data) {
        const apiComponente = Array.isArray(response.data)
          ? response.data[0]
          : response.data;
        if (apiComponente) {
          const newComponente: Componente = {
            id: apiComponente.id,
            componente: apiComponente.componente,
            elementos: apiComponente.elementos,
            peso: parseFloat(apiComponente.peso),
            createdAt: apiComponente.createdAt,
            updatedAt: apiComponente.updatedAt,
          };
          setTableData((prevData) => [...prevData, newComponente]);
          console.log("Componente agregado exitosamente");
        }
      } else {
        console.error("Error al agregar componente");
      }
    } catch (error) {
      console.error("Error al insertar componente:", error);
    }
  };

  useEffect(() => {
    const loadComponentes = async () => {
      try {
        const response = await getComponentes();
        if (response.success && response.data) {
          // Convert API response to Componente type
          const convertedData: Componente[] = response.data.map((item) => ({
            id: item.id,
            componente: item.componente,
            elementos: item.elementos,
            peso: parseFloat(item.peso),
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          }));
          setTableData(convertedData);
        }
      } catch (error) {
        console.error("Error loading componentes:", error);
      }
    };
    void loadComponentes();
  }, []);

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
                    <TableHead className="w-1/4">
                      Componente o Sistema
                    </TableHead>
                    <TableHead className="w-1/4">
                      Peso del componente o sistema
                    </TableHead>
                    <TableHead className="w-1/2">
                      Elementos a valorar del componente o sistema
                    </TableHead>
                    <TableHead className="w-1/4">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell className="w-1/4">
                        {editRowIndex === index ? (
                          <input
                            type="text"
                            value={row.componente}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "componente",
                                e.target.value,
                              )
                            }
                            className="w-full rounded border px-2 py-1"
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
                              handleInputChange(
                                index,
                                "peso",
                                isNaN(value) ? 0 : value,
                              );
                            }}
                            className="w-full rounded border px-2 py-1"
                          />
                        ) : (
                          `${row.peso}%`
                        )}
                      </TableCell>

                      <TableCell className="w-1/2">
                        {editRowIndex === index ? (
                          <input
                            type="text"
                            value={row.elementos}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "elementos",
                                e.target.value,
                              )
                            }
                            className="w-full rounded border px-2 py-1"
                          />
                        ) : (
                          row.elementos
                        )}
                      </TableCell>

                      <TableCell className="w-1/4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          {editRowIndex === index ? (
                            <Button
                              className="rounded px-4 py-2 text-white"
                              onClick={() => handleSaveClick(index)}
                            >
                              Guardar
                            </Button>
                          ) : (
                            <Button
                              className="rounded px-4 py-2 text-white"
                              onClick={() => handleEditClick(index)}
                            >
                              Editar
                            </Button>
                          )}
                          <Button
                            className="rounded bg-red-500 px-4 py-2 text-white"
                            onClick={() => handleDeleteClick(row.id)}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell className="w-1/4">Total</TableCell>
                    <TableCell className="w-1/4">
                      {calculateTotalWeight()}%
                    </TableCell>
                    <TableCell className="w-1/2"></TableCell>
                    <TableCell className="w-1/4"></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        <div className="mt-4 text-center">
          <Button
            className="rounded px-4 py-2 text-white"
            onClick={(event) => handleSubmit(event)}
          >
            Agregar Componente
          </Button>
        </div>
      </div>
    </div>
  );
}
