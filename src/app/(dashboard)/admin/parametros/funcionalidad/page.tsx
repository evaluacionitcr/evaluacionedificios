"use client";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect, MouseEvent } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { getFuncionalidades, createFuncionalidad, updateFuncionalidad, deleteFuncionalidad } from "./actions";

interface Funcionalidad {
  id: number;
  estado: string;
  puntuacion: number;
  descripcion: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface APIFuncionalidad {
    id: number;
    estado: string;
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
          estado: row.estado,
          puntuacion: row.puntuacion,
          descripcion: row.descripcion,
        };
    
        updateFuncionalidad(data)
          .then((response) => {
            console.log("Response:", response);
            if (response.success) {
              console.log("Funcionalidad actualizada exitosamente");
              setEditRowIndex(null);
            } else {
              console.error("Error al actualizar funcionalidad");
            }
          })
          .catch((error) => {
            console.error("Error al actualizar funcionalidad:", error);
          });
      };

      const handleDeleteClick = (id: number) => {
          deleteFuncionalidad(id)
            .then((response) => {
              if (response.success) {
                console.log("Funcionalidad eliminada exitosamente");
                setTableData((prevData) => prevData.filter((row) => row.id !== id));
              } else {
                console.error("Error al eliminar funcionalidad");
              }
            })
            .catch((error) => {
              console.error("Error al eliminar funcionalidad:", error);
            });
        };
    
          
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
    
        const newRow: Omit<Funcionalidad, "id"> = {
          estado: "Nueva funcionalidad",
          puntuacion: 0,
          descripcion: "Descripción de la nueva funcionalidad",
        };
    
        try {
          const response = await createFuncionalidad(newRow);
          if (response.success && response.data) {
            const apiFuncionalidad = Array.isArray(response.data)
              ? response.data[0]
              : response.data;
            if (apiFuncionalidad) {
              const newComponente: Funcionalidad = {
                id: apiFuncionalidad.id,
                estado: apiFuncionalidad.Estado,
                descripcion: apiFuncionalidad.Descripcion,
                puntuacion: parseFloat(apiFuncionalidad.Puntuacion),
                createdAt: apiFuncionalidad.createdAt,
                updatedAt: apiFuncionalidad.updatedAt,
              };
              setTableData((prevData) => [...prevData, newComponente]);
              console.log("Funcionalidad agregada exitosamente");
            }
          } else {
            console.error("Error al agregar funcionalidad:", response.error);
          }
        } catch (error) {
          console.error("Error al insertar funcionalidad:", error);
        }
      };

      useEffect(() => {
          const loadFuncionalidades = async () => {
            try {
              const response = await getFuncionalidades();
              if (response.success && response.data) {
                // Convert API response to Funcionalidades type
                const convertedData: Funcionalidad[] = response.data.map((item) => ({
                  id: item.id,
                  estado: item.Estado,
                  descripcion: item.Descripcion,
                  puntuacion: parseFloat(item.Puntuacion),
                  createdAt: item.createdAt,
                  updatedAt: item.updatedAt,
                }));
                setTableData(convertedData);
              }
            } catch (error) {
              console.error("Error loading funcionalidades:", error);
            }
          };
          void loadFuncionalidades();
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
                  {tableData.map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell className="w-1/4">
                        {editRowIndex === index ? (
                          <input
                            type="text"
                            value={row.estado}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "estado",
                                e.target.value,
                              )
                            }
                            className="w-full rounded border px-2 py-1"
                          />
                        ) : (
                          row.estado
                        )}
                      </TableCell>

                      <TableCell className="w-1/4">
                        {editRowIndex === index ? (
                          <input
                            type="number"
                            value={row.puntuacion}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value);
                              handleInputChange(
                                index,
                                "puntuacion",
                                isNaN(value) ? 0 : value,
                              );
                            }}
                            className="w-full rounded border px-2 py-1"
                          />
                        ) : (
                          `${row.puntuacion}`
                        )}
                      </TableCell>

                      <TableCell className="w-1/2">
                        {editRowIndex === index ? (
                          <input
                            type="text"
                            value={row.descripcion}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "descripcion",
                                e.target.value,
                              )
                            }
                            className="w-full rounded border px-2 py-1"
                          />
                        ) : (
                          row.descripcion
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
            Agregar Funcionalidad
          </Button>
        </div>
      </div>
    </div>
  );
}