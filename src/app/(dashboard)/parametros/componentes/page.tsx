"use client";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { getComponentes, createComponente, updateComponente } from "./actions"; // Asegúrate de importar la función
import { set } from "zod";

export default function Page() {
    const [editRowIndex, setEditRowIndex] = useState<number | null>(null);
    const [tableData, setTableData] = useState<any[]>([]);

    const handleEditClick = (index: number) => {
      setEditRowIndex(index);
    };

    const handleInputChange = (index: number, field: string, value: any) => {
      const updatedData = [...tableData];
      updatedData[index][field] = value;
      setTableData(updatedData);
    };

    const handleSaveClick = (index: number) => {
        const data = {
            id: tableData[index].id,
            componente: tableData[index].componente,
            peso: tableData[index].peso,
            elementos: tableData[index].elementos
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

    const calculateTotalWeight = () => {
      return tableData.reduce((total, row) => total + (parseFloat(row.peso) || 0), 0);
    };

    // Imprimir los datos de la tabla en la consola
    const printTableData = () => {
      console.log("Table Data:", tableData);
    }

    // Agregar componente a la lista y base de datos
    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();

      const newRow = {
        componente: "Nuevo Componente",
        peso: 0,
        elementos: "Nuevos elementos",
      };

      // Agregar al estado de la tabla
      setTableData((prevData) => [...prevData, newRow]);

      // Llamar a la función para insertar en la base de datos
      try {
        const response = await createComponente({
          componente: newRow.componente,
          peso: newRow.peso,
          elementos: newRow.elementos
        });
        if (response.success) {
          console.log("Componente agregado exitosamente");
        } else {
          console.error("Error al agregar componente");
        }
      } catch (error) {
        console.error("Error al insertar componente:", error);
      }
    };

    useEffect(() => {
      // Cargar los componentes desde la base de datos al cargar la página
      const loadComponentes = async () => {
        try {
          // Aquí puedes usar tu función `getComponentes` si es necesario
          const response = await getComponentes();
          setTableData(response.data ?? []);
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
                      <TableHead className="w-1/4">Componente o Sistema</TableHead>
                      <TableHead className="w-1/4">Peso del componente o sistema</TableHead>
                      <TableHead className="w-1/2">Elementos a valorar del componente o sistema</TableHead>
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
                                handleInputChange(index, "componente", e.target.value)
                              }
                              className="border rounded px-2 py-1 w-full"
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
                            `${row.peso}%`
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

                        <TableCell className="w-1/4 text-center">
                            <div className="flex space-x-2 justify-center items-center">
                                {editRowIndex === index ? (
                                <Button
                                  className="text-white px-4 py-2 rounded"
                                  onClick={() => handleSaveClick(index)}
                                >
                                    Guardar
                                </Button>
                                ) : (
                                <Button
                                  className="text-white px-4 py-2 rounded"
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
                            </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell className="w-1/4">Total</TableCell>
                      <TableCell className="w-1/4">{calculateTotalWeight()}%</TableCell>
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
              onClick={(event) => handleSubmit(event)} // Agregar componente al estado y la base de datos 
            >
              Agregar Componente
            </Button>
          </div>
        </div>
      </div>
    );
}   
