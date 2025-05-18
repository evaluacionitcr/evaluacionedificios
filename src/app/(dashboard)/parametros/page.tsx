"use client";
import { useEffect, useState } from "react";
import { Param } from "drizzle-orm";

import Link from "next/link"; 
import { Button } from "~/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";

interface Eje {
  id: number;
  eje: string;
  peso: number;
}

export default function Page() {
  const [ejes, setEjes] = useState<Eje[]>([
    { id: 1, eje: "FUNCIONAL", peso: 40 },
    { id: 2, eje: "ESTRATEGICO", peso: 30 },
  ]);
  const [editRowIndex, setEditRowIndex] = useState<number | null>(null);

  const handleEditClick = (index: number) => {
    setEditRowIndex(index);
  };

  const handleInputChange = (
    index: number,
    field: keyof Omit<Eje, "id">,
    value: string | number,
  ) => {
    const updatedData = [...ejes];
    const currentRow = updatedData[index];
    if (currentRow) {
      updatedData[index] = {
        ...currentRow,
        [field]: value,
      };
      setEjes(updatedData);
    }
  };

  const handleSaveClick = (index: number) => {
    // Aquí se podría implementar la lógica para guardar en una API
    setEditRowIndex(null);
  };

  const handleDeleteClick = (id: number) => {
    setEjes((prevData) => prevData.filter((eje) => eje.id !== id));
  };

  const handleAddEje = () => {
    const newId = ejes.length > 0 ? Math.max(...ejes.map(eje => eje.id)) + 1 : 1;
    const newEje: Eje = {
      id: newId,
      eje: "Nuevo Eje",
      peso: 0,
    };
    setEjes([...ejes, newEje]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Parámetros</h1>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Criterios para evaluación</h1>
        <div className="flex gap-2">
          
          <Link href={`/parametros/ejemplo`}>
            <Button>Previsualizar Evaluacion</Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto py-6 border border-gray-300 rounded-xl">
        <Table>
          <TableBody /* Componentes */>
              <TableRow>
                <TableCell className="text-xl font-semibold sm:text-2xl">Componentes</TableCell>
                <TableCell className="text-right">
                  <Link href={`/parametros/componentes`}>
                    <Button>
                      Editar
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>

           
              <TableRow /* Estado de conservación */>
                <TableCell className="text-xl font-semibold sm:text-2xl">Estado de conservación</TableCell>
                <TableCell className="text-right">
                  <Link href={`/parametros/conservacion`}>
                    <Button>
                      Editar
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>

              <TableRow /* Funcionalidad */>
                <TableCell className="text-xl font-semibold sm:text-2xl">Funcionalidad </TableCell>
                <TableCell className="text-right">
                  <Link href={`/parametros/funcionalidad`}>
                    <Button>
                      Editar
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>

              <TableRow /* Normativa */>
                <TableCell className="text-xl font-semibold sm:text-2xl">Normativa </TableCell>
                <TableCell className="text-right">
                  <Link href={`/parametros/normativa`}>
                    <Button>
                      Editar
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>

          </TableBody>
        </Table>
      </div>      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Ejes para Priorización</h1>
        <div className="flex gap-2">
            <Link href={`/parametros/priorizacion/preview`}>
            <Button>Previsualizar Priorización</Button>
          </Link>

          <Button onClick={handleAddEje}>Agregar Eje</Button>
        </div>      </div><div className="container mx-auto py-6 border border-gray-300 rounded-xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Eje</TableHead>
              <TableHead>Peso (%)</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ejes.map((eje, index) => (
              <TableRow key={eje.id}>
                <TableCell className="w-1/3">
                  {editRowIndex === index ? (
                    <input
                      type="text"
                      value={eje.eje}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "eje",
                          e.target.value,
                        )
                      }
                      className="w-full rounded border px-2 py-1"
                    />
                  ) : (
                    <span className="text-xl font-semibold sm:text-2xl">{eje.eje}</span>
                  )}
                </TableCell>
                <TableCell className="w-1/3">
                  {editRowIndex === index ? (
                    <input
                      type="number"
                      value={eje.peso}
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
                    `${eje.peso}%`
                  )}
                </TableCell>
                <TableCell className="w-1/3 text-right">
                  <div className="flex justify-end space-x-2">
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
                    <Link href={`/parametros/priorizacion/${eje.id}`}>
                      <Button>
                        Parametros
                      </Button>
                    </Link>
                    <Button 
                      variant="destructive"
                      onClick={() => handleDeleteClick(eje.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>))}
          </TableBody>
        </Table>
        </div>
    </div>
  );
}