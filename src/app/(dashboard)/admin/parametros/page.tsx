"use client";
import { useEffect, useState } from "react";
import Link from "next/link"; 
import { Button } from "~/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { getEjes, createEje, updateEje, deleteEje } from "./actions";
import { toast } from "sonner";

interface Eje {
  id: number;
  eje: string;
  peso: number;
}

interface EjeDB {
  id: number;
  eje: string;
  peso: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export default function Page(): JSX.Element {
  const [ejes, setEjes] = useState<Eje[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editRowIndex, setEditRowIndex] = useState<number | null>(null);

  useEffect(() => {
    async function loadEjes(): Promise<void> {
      setLoading(true);
      try {
        const result: ApiResponse<EjeDB[]> = await getEjes();
        if (result.success && result.data) {
          // Convertir los valores de peso de string a number
          const formattedEjes = result.data.map((ejeDB): Eje => ({
            id: ejeDB.id,
            eje: ejeDB.eje,
            peso: parseFloat(ejeDB.peso)
          }));
          setEjes(formattedEjes);
        } else {
          toast.error(result.error ?? "Error al cargar los ejes");
          // Cargar datos por defecto si hay error
          setEjes([
            { id: 1, eje: "FUNCIONAL", peso: 40 },
            { id: 2, eje: "ESTRATEGICO", peso: 30 },
          ]);
        }
      } catch (error: unknown) {
        console.error("Error cargando ejes:", error);
        toast.error("Error al cargar los ejes");
        // Cargar datos por defecto si hay error
        setEjes([
          { id: 1, eje: "FUNCIONAL", peso: 40 },
          { id: 2, eje: "ESTRATEGICO", peso: 30 },
        ]);
      } finally {
        setLoading(false);
      }
    }

    void loadEjes();
  }, []);

  const handleEditClick = (index: number): void => {
    setEditRowIndex(index);
  };

  const handleInputChange = (
    index: number,
    field: keyof Omit<Eje, "id">,
    value: string | number,
  ): void => {
    const updatedData = [...ejes];
    const currentRow = updatedData[index];
    
    // Si el campo es 'peso', validamos que esté entre 0 y 100
    if (field === 'peso' && typeof value === 'number') {
      // Limitar el valor entre 0 y 100
      value = Math.min(100, Math.max(0, value));
    }
    
    if (currentRow) {
      updatedData[index] = {
        ...currentRow,
        [field]: value,
      };
      setEjes(updatedData);
    }
  };

  const handleSaveClick = async (index: number): Promise<void> => {
    try {
      const eje = ejes[index];
      if (!eje) return;
      
      // Validaciones básicas
      if (!eje.eje.trim()) {
        toast.error("El nombre del eje no puede estar vacío");
        return;
      }
      
      // Validar que el peso sea un número válido y esté entre 0 y 100
      if (isNaN(eje.peso) || eje.peso < 0 || eje.peso > 100) {
        toast.error("El peso debe ser un número entre 0 y 100");
        return;
      }
      
      // Si el eje ya existe en la base de datos, actualizar
      if (eje.id) {
        const result: ApiResponse<EjeDB> = await updateEje({
          id: eje.id,
          eje: eje.eje,
          peso: eje.peso
        });
        
        if (result.success) {
          toast.success("Eje actualizado correctamente");
          // Refrescar los ejes
          const ejesTodosResult: ApiResponse<EjeDB[]> = await getEjes();
          if (ejesTodosResult.success && ejesTodosResult.data) {
            const formattedEjes = ejesTodosResult.data.map((ejeDB): Eje => ({
              id: ejeDB.id,
              eje: ejeDB.eje,
              peso: parseFloat(ejeDB.peso)
            }));
            setEjes(formattedEjes);
          }
        } else {
          toast.error(result.error ?? "Error al actualizar eje");
        }
      }
      
      setEditRowIndex(null);
    } catch (error: unknown) {
      console.error("Error al guardar eje:", error);
      toast.error("Ocurrió un error al guardar el eje");
    }
  };

  const handleDeleteClick = async (id: number): Promise<void> => {
    try {
      const result: ApiResponse<unknown> = await deleteEje(id);
      
      if (result.success) {
        toast.success("Eje eliminado correctamente");
        setEjes((prevData) => prevData.filter((eje) => eje.id !== id));
      } else {
        toast.error(result.error ?? "Error al eliminar eje");
      }
    } catch (error: unknown) {
      console.error("Error al eliminar eje:", error);
      toast.error("Ocurrió un error al eliminar el eje");
    }
  };

  const handleAddEje = async (): Promise<void> => {
    try {
      // Calcular un peso inicial adecuado
      // Se podría establecer un valor inicial de 0 o calcular un peso disponible
      const pesoInicial = 0; // Comenzar con 0 para que el usuario lo ajuste
      
      const result: ApiResponse<EjeDB> = await createEje({ 
        eje: "Nuevo Eje", 
        peso: pesoInicial
      });
      
      if (result.success && result.data) {
        toast.success("Eje creado correctamente");
        // Convertir el peso de string a number
        const newEje: Eje = {
          id: result.data.id,
          eje: result.data.eje,
          peso: parseFloat(result.data.peso)
        };
        setEjes([...ejes, newEje]);
      } else {
        toast.error(result.error ?? "Error al crear eje");
      }
    } catch (error: unknown) {
      console.error("Error al crear eje:", error);
      toast.error("Ocurrió un error al crear el eje");
    }
  };

  // Calcular el peso total de los ejes
  const calculateTotalWeight = (): number => {
    return ejes.reduce((total, eje) => total + Number(eje.peso || 0), 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Parámetros</h1>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Criterios para evaluación</h1>
      </div>

      <div className="container mx-auto py-6 border border-gray-300 rounded-xl">
        <Table>
          <TableBody>
              {/* Componentes */}
              <TableRow>
                <TableCell className="text-xl font-semibold sm:text-2xl">Componentes</TableCell>
                <TableCell className="text-right">
                  <Link href="/admin/parametros/componentes">
                    <Button>
                      Editar
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>

              {/* Estado de conservación */}
              <TableRow>
                <TableCell className="text-xl font-semibold sm:text-2xl">Estado de conservación</TableCell>
                <TableCell className="text-right">
                  <Link href="/admin/parametros/conservacion">
                    <Button>
                      Editar
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>

              {/* Funcionalidad */}
              <TableRow>
                <TableCell className="text-xl font-semibold sm:text-2xl">Funcionalidad </TableCell>
                <TableCell className="text-right">
                  <Link href="/admin/parametros/funcionalidad">
                    <Button>
                      Editar
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>

              {/* Normativa */}
              <TableRow>
                <TableCell className="text-xl font-semibold sm:text-2xl">Normativa </TableCell>
                <TableCell className="text-right">
                  <Link href="/admin/parametros/normativa">
                    <Button>
                      Editar
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Ejes para Priorización</h1>
        <div className="flex gap-2">
          <Button onClick={handleAddEje}>Agregar Eje</Button>
        </div>
      </div>
      
      <div className="container mx-auto py-6 border border-gray-300 rounded-xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Eje</TableHead>
              <TableHead>Peso (%)</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">Cargando ejes...</p>
                </TableCell>
              </TableRow>
            ) : ejes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4 text-gray-500">
                  No hay ejes de priorización definidos
                </TableCell>
              </TableRow>
            ) : (
              ejes.map((eje, index) => (
                <TableRow key={eje.id}>
                  <TableCell className="w-1/3">
                    {editRowIndex === index ? (
                      <input
                        type="text"
                        value={eje.eje}
                        onChange={(e): void =>
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
                        min="0"
                        max="100"
                        step="1"
                        value={eje.peso}
                        onChange={(e): void => {
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
                          onClick={(): void => {
                            void handleSaveClick(index);
                          }}
                        >
                          Guardar
                        </Button>
                      ) : (
                        <Button
                          className="rounded px-4 py-2 text-white"
                          onClick={(): void => handleEditClick(index)}
                        >
                          Editar
                        </Button>
                      )}
                      <Link href={`/admin/parametros/criterios/${eje.id}`}>
                        <Button>
                          Criterios
                        </Button>
                      </Link>
                      <Button 
                        variant="destructive"
                        onClick={(): void => {
                          void handleDeleteClick(eje.id);
                        }}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
            {/* Mostrar el total de los pesos */}
            {ejes.length > 0 && (
              <TableRow>
                <TableCell className="w-1/3 text-xl font-semibold">Total</TableCell>
                <TableCell className="w-1/3">
                  <div className="flex items-center">
                    <span className={`font-medium ${calculateTotalWeight() !== 100 ? "text-yellow-600" : ""}`}>
                      {calculateTotalWeight()}%
                    </span>
                    {calculateTotalWeight() !== 100 && (
                      <span className="ml-2 text-sm text-yellow-600">
                        (Se recomienda que los ejes sumen 100%)
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="w-1/3"></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}