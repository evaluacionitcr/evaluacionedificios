"use client";
import React, { useEffect, useState } from "react";
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
import { getEstadoConservacion, createEstadoConservacion, updateEstadoConservacion, deleteEstadoConservacion } from "./actions";

interface EstadoConservacion {
  id: number;
  estado_conservacion: string;
  condiciones_fisicas: string;
  clasificacion: string;
  coef_depreciacion: number;
}

export default function Page() {
  const [tableData, setTableData] = useState<EstadoConservacion[]>([]);
  const [editRowIndex, setEditRowIndex] = useState<number | null>(null);

  const handleEditClick = (index: number) => {
    setEditRowIndex(index);
  };

  const handleInputChange = (
    index: number, 
    field: keyof Omit<EstadoConservacion, "id">,
    value: string | number
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

    const data: EstadoConservacion = {
        id: row.id,
        estado_conservacion: row.estado_conservacion,
        condiciones_fisicas: row.condiciones_fisicas,
        clasificacion: row.clasificacion,
        coef_depreciacion: parseFloat(row.coef_depreciacion.toString()),
    };

    updateEstadoConservacion(data).then((response) => {
        console.log("Response:", response);
        if (response.success) {
            console.log("Estado de conservación actualizado:", response.data);
            setEditRowIndex(null); // Cerrar el modo de edición
        } else {
            console.error("Error al actualizar el estado de conservación:", response.error);
        }
    }).catch((error) => {
        console.error("Error al actualizar el estado de conservación:", error);
    });
    };


    const handleDeleteClick = (id: number) => {
        deleteEstadoConservacion(id)
        .then((response) => {
            if (response.success) {
                console.log("Estado de conservación eliminado");
                setTableData((prevData) => prevData.filter((row) => row.id !== id));
            } else {
                console.error("Error al eliminar el estado de conservación:", response.error);
            }
        })
        .catch((error) => {
            console.error("Error al eliminar el estado de conservación:", error);
        });
    };




  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    const newEstadoConservacion: Omit<EstadoConservacion,"id"> = {
        estado_conservacion: "Nuevo Estado",
        condiciones_fisicas: "Condiciones Físicas",
        clasificacion: "Clasificación",
        coef_depreciacion: 0,
    };

    try {
        const response = await createEstadoConservacion(newEstadoConservacion);
        if (response.success && response.data) {
            const apiEstado = Array.isArray(response.data) ? response.data[0] : response.data;

            if (apiEstado) {
                const newEstado: EstadoConservacion = {
                    id: apiEstado.id,
                    estado_conservacion: apiEstado.estado_conservacion,
                    condiciones_fisicas: apiEstado.condiciones_fisicas,
                    clasificacion: apiEstado.clasificacion,
                    coef_depreciacion: parseFloat(apiEstado.coef_depreciacion),
                };
                setTableData((prevData) => [...prevData, newEstado]);
            }
        } else {
            console.error("Error al crear el estado de conservación:", response.error);
        }
    } catch (error) {
        console.error("Error al crear el estado de conservación:", error);
    }
  };

  // Simulación de carga de datos estáticos
  useEffect(() => {
    const loadEstadoConservacion = async () => {
        try {
            const response = await getEstadoConservacion();
            if (response.success && response.data) {
                const convertedData : EstadoConservacion[] = response.data.map((item: any) => ({
                    id: item.id,
                    estado_conservacion: item.estado_conservacion,
                    condiciones_fisicas: item.condiciones_fisicas,
                    clasificacion: item.clasificacion,
                    coef_depreciacion: item.coef_depreciacion,
                }));
                setTableData(convertedData);
            }
        } catch (error) {
            console.error("Error al cargar el estado de conservación:", error);
        }
      };
    loadEstadoConservacion();
  }, []); // Se ejecuta solo una vez cuando el componente se monta

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/parametros">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5 text-primary" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-primary">Estado de Conservación</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-white shadow-sm">
          <CardContent>
            <div className="overflow-x-auto p-4">
              <Table className="table-fixed">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/4">Estado de Conservación</TableHead>
                    <TableHead className="w-1/2">Condiciones Físicas</TableHead>
                    <TableHead className="w-1/4">Clasificación</TableHead>
                    <TableHead className="w-1/4">Coef. Depreciación</TableHead>
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
                            value={row.estado_conservacion}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "estado_conservacion",
                                e.target.value
                              )
                            }
                            className="w-full rounded border px-2 py-1"
                          />
                        ) : (
                          row.estado_conservacion
                        )}
                      </TableCell>

                      <TableCell className="w-1/2">
                        {editRowIndex === index ? (
                          <input
                            type="text"
                            value={row.condiciones_fisicas}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "condiciones_fisicas",
                                e.target.value
                              )
                            }
                            className="w-full rounded border px-2 py-1"
                          />
                        ) : (
                          row.condiciones_fisicas
                        )}
                      </TableCell>

                      <TableCell className="w-1/4">
                        {editRowIndex === index ? (
                          <input
                            type="text"
                            value={row.clasificacion}
                            onChange={(e) =>
                              handleInputChange(index, "clasificacion", e.target.value)
                            }
                            className="w-full rounded border px-2 py-1"
                          />
                        ) : (
                          row.clasificacion
                        )}
                      </TableCell>

                      <TableCell className="w-1/4">
                        {editRowIndex === index ? (
                          <input
                            type="text"
                            value={row.coef_depreciacion}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "coef_depreciacion",
                                e.target.value
                              )
                            }
                            className="w-full rounded border px-2 py-1"
                          />
                        ) : (
                          row.coef_depreciacion
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
                            onClick={() => {
                              handleDeleteClick(row.id); // Función para eliminar el estado de conservación
                            }}
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
            onClick={handleSubmit} // Función para agregar un nuevo estado de conservación
          >
            Agregar Estado de Conservación
          </Button>
        </div>
      </div>
    </div>
  );
}
