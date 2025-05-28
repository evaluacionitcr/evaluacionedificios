"use client";
import { Fragment, useEffect, useState } from "react";
import Link from "next/link"; 
import { Button } from "~/components/ui/button";
import { useParams } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { ChevronDown, ChevronRight } from "lucide-react";
import { 
  getEjeById,
  getCriteriosByEjeId,
  getParametrosByCriterioId,
  createCriterio,
  createParametro,
  updateCriterio,
  updateParametro,
  deleteCriterio,
  deleteParametro
} from "./actions";

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

interface Criterio {
  id: number;
  ejesPriorizacionId: number;
  criterio: string;
  peso: number;
}

interface CriterioDB {
  id: number;
  ejesPriorizacionId: number | null;
  criterio: string;
  peso: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface Parametro {
  id: number;
  criteriosPriorizacionId: number;
  parametro: string;
  peso: number;
}

interface ParametroDB {
  id: number;
  criteriosPriorizacionId: number | null;
  parametro: string;
  peso: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default function Page(): JSX.Element {
  const [ejes, setEjes] = useState<Eje[]>([]);
  const [criterios, setCriterios] = useState<Criterio[]>([]);
  const [parametros, setParametros] = useState<Parametro[]>([]);
  const [editRowIndex, setEditRowIndex] = useState<number | null>(null);
  const [editParametroId, setEditParametroId] = useState<number | null>(null);
  const [currentEje, setCurrentEje] = useState<Eje | null>(null);
  const [originalParametros, setOriginalParametros] = useState<Parametro[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // Estado para controlar las filas expandidas
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  
  // Buscar el eje actual basado en el ID de la URL  
  const params = useParams();
  const ejeId = params.id ? Number(params.id) : null;
  
  // Cargar los datos iniciales
  useEffect(() => {
    const loadData = async (): Promise<void> => {
      if (ejeId) {
        setIsLoading(true);
        try {
          // Cargar el eje
          const ejeData = await getEjeById(ejeId);
          if (ejeData) {
            // Convertir el peso a número si es necesario
            const eje: Eje = {
              id: ejeData.id,
              eje: ejeData.eje,
              peso: Number(ejeData.peso)
            };
            setCurrentEje(eje);
            setEjes([eje]);
          }

          // Cargar los criterios
          const criteriosData = await getCriteriosByEjeId(ejeId);
          if (criteriosData) {
            // Convertir los pesos a números y asegurarse de que el tipo es correcto
            const criteriosWithNumericPeso: Criterio[] = criteriosData.map((criterio: CriterioDB): Criterio => ({
              id: criterio.id,
              ejesPriorizacionId: criterio.ejesPriorizacionId || ejeId, // En caso de que sea null
              criterio: criterio.criterio,
              peso: Number(criterio.peso)
            }));
            setCriterios(criteriosWithNumericPeso);

            // Cargar los parámetros para cada criterio
            const allParametros: Parametro[] = [];
            for (const criterio of criteriosData) {
              const parametrosData = await getParametrosByCriterioId(criterio.id);
              if (parametrosData && parametrosData.length > 0) {
                // Convertir los pesos a números y asegurarse de que el tipo es correcto
                const parametrosWithNumericPeso: Parametro[] = parametrosData.map((parametro: ParametroDB): Parametro => ({
                  id: parametro.id,
                  criteriosPriorizacionId: parametro.criteriosPriorizacionId || criterio.id, // En caso de que sea null
                  parametro: parametro.parametro,
                  peso: Number(parametro.peso)
                }));
                allParametros.push(...parametrosWithNumericPeso);
              }
            }
            setParametros(allParametros);
          }
        } catch (error: unknown) {
          console.error("Error al cargar los datos:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    void loadData();
  }, [ejeId]);

  const handleEditClick = (index: number): void => {
    setEditRowIndex(index);
  };
  
  const handleInputChange = (
    index: number,
    field: keyof Omit<Criterio, "id" | "ejesPriorizacionId">,
    value: string | number,
  ): void => {
    const updatedData = [...criterios];
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
      setCriterios(updatedData);
    }
  };
  
  const handleSaveClick = async (index: number): Promise<void> => {
    // Validar que el nombre del criterio no esté vacío
    if (!criterios[index] || criterios[index].criterio.trim() === "") {
      alert("El nombre del criterio no puede estar vacío");
      return;
    }
    
    // Validar que el peso sea un número válido
    if (isNaN(Number(criterios[index].peso))) {
      alert("El peso debe ser un valor numérico válido");
      return;
    }
    
    // Validar que el peso esté entre 0 y 100
    const peso = Number(criterios[index].peso);
    if (peso < 0 || peso > 100) {
      alert("El peso debe ser un valor entre 0 y 100");
      return;
    }
    
    // Verificar que el peso total no exceda el peso del eje
    const totalPeso = calculateTotalWeight();
    if (currentEje && totalPeso > currentEje.peso) {
      alert(`El peso total de los criterios (${totalPeso}%) excede el peso del eje (${currentEje.peso}%)`);
      return;
    }
    
    // Guardar los cambios en la API
    try {
      const criterio = criterios[index];
      await updateCriterio({
        id: criterio.id,
        criterio: criterio.criterio,
        peso: Number(criterio.peso)
      });
      
      setEditRowIndex(null);
    } catch (error: unknown) {
      console.error("Error al guardar el criterio:", error);
      alert("Error al guardar los cambios. Inténtalo de nuevo.");
    }
  };

  const handleDeleteClick = async (id: number): Promise<void> => {
    try {
      await deleteCriterio(id);
      setCriterios((prevData) => prevData.filter((criterio) => criterio.id !== id));
      
      // También eliminar los parámetros asociados del estado local
      setParametros((prevParams) => 
        prevParams.filter((parametro) => parametro.criteriosPriorizacionId !== id)
      );
    } catch (error: unknown) {
      console.error("Error al eliminar el criterio:", error);
      alert("Error al eliminar el criterio. Inténtalo de nuevo.");
    }
  };
  
  const handleAddCriterio = async (): Promise<void> => {
    if (!currentEje) return;
    
    // Calcular un peso inicial adecuado (entre 0 y 100)
    const pesoTotal = calculateTotalWeight();
    const pesoDisponible = Math.max(0, Math.min(100, currentEje.peso - pesoTotal));
    
    try {
      const result = await createCriterio({
        criterio: "Nuevo Criterio",
        peso: pesoDisponible, // Usar el peso disponible como valor inicial
        ejeId: currentEje.id
      });
      
      if (result) {
        // Asegurarnos de crear un objeto de tipo Criterio válido
        const nuevoCriterio: Criterio = {
          id: result.id,
          ejesPriorizacionId: currentEje.id,
          criterio: result.criterio,
          peso: Number(result.peso)
        };
        
        // Agregar el nuevo criterio al estado local
        setCriterios([...criterios, nuevoCriterio]);
        
        // Iniciar edición del nuevo criterio
        setEditRowIndex(criterios.length);
      }
    } catch (error: unknown) {
      console.error("Error al crear el criterio:", error);
      alert("Error al crear el criterio. Inténtalo de nuevo.");
    }
  };
  
  const calculateTotalWeight = (): number => {
    return criterios.reduce((total, row) => total + Number(row.peso || 0), 0);
  };
  
  // Calcular el peso total de los parámetros para un criterio específico
  const calculateParametrosTotalWeight = (criterioId: number): number => {
    return parametros
      .filter(parametro => parametro.criteriosPriorizacionId === criterioId)
      .reduce((total, parametro) => total + Number(parametro.peso || 0), 0);
  };
  
  // Función para alternar el estado expandido/colapsado de una fila
  const toggleRowExpansion = (criterioId: number): void => {
    // Si estamos cerrando la fila que contiene un parámetro en edición, salimos del modo edición
    if (expandedRows[criterioId] && editParametroId !== null) {
      // Verificamos si el parámetro en edición pertenece a este criterio
      const parametroEnEdicion = parametros.find(p => p.id === editParametroId);
      if (parametroEnEdicion && parametroEnEdicion.criteriosPriorizacionId === criterioId) {
        setEditParametroId(null);
      }
    }
    
    setExpandedRows((prev) => ({
      ...prev,
      [criterioId]: !prev[criterioId],
    }));
  };
  
  // Función para añadir un nuevo parámetro a un criterio
  const handleAddParametro = async (criterioId: number): Promise<void> => {
    // Encontrar el criterio correspondiente
    const criterio = criterios.find(c => c.id === criterioId);
    if (!criterio) return;
    
    // Calcular el peso actual de todos los parámetros del criterio
    const pesoActual = calculateParametrosTotalWeight(criterioId);
    
    // Calcular el peso disponible (asegurando que esté entre 0 y 1)
    const pesoDisponible = Math.min(1, Math.max(0, Number(criterio.peso) - pesoActual));
    
    try {
      const newParametro = await createParametro({
        parametro: "Nuevo Parámetro",
        peso: pesoDisponible > 0 ? pesoDisponible : 0,
        criterioId: criterioId
      });
      
      if (newParametro) {
        // Crear un objeto de tipo Parametro válido
        const nuevoParametro: Parametro = {
          id: newParametro.id,
          criteriosPriorizacionId: criterioId,
          parametro: newParametro.parametro,
          peso: Number(newParametro.peso)
        };
        
        // Agregarlo al estado local
        setParametros([...parametros, nuevoParametro]);
        
        // Iniciar edición del nuevo parámetro
        setOriginalParametros([...parametros]);
        setEditParametroId(newParametro.id);
      }
    } catch (error: unknown) {
      console.error("Error al crear el parámetro:", error);
      alert("Error al crear el parámetro. Inténtalo de nuevo.");
    }
  };
  
  // Función para eliminar un parámetro
  const handleDeleteParametro = async (parametroId: number): Promise<void> => {
    try {
      await deleteParametro(parametroId);
      setParametros(parametros.filter(p => p.id !== parametroId));
    } catch (error: unknown) {
      console.error("Error al eliminar el parámetro:", error);
      alert("Error al eliminar el parámetro. Inténtalo de nuevo.");
    }
  };
  
  // Función para iniciar la edición de un parámetro
  const handleEditParametro = (parametroId: number): void => {
    // Guardar el estado original de los parámetros antes de editar
    setOriginalParametros([...parametros]);
    setEditParametroId(parametroId);
  };
    
  // Función para guardar cambios en un parámetro
  const handleSaveParametro = async (): Promise<void> => {
    if (editParametroId === null) return;
    
    const parametroEditado = parametros.find(p => p.id === editParametroId);
    if (!parametroEditado) return;
    
    // Validar que el peso sea un número válido
    if (isNaN(Number(parametroEditado.peso))) {
      alert("El peso debe ser un valor numérico válido");
      return;
    }
    
    // Validar que el peso esté entre 0 y 1
    if (Number(parametroEditado.peso) < 0 || Number(parametroEditado.peso) > 1) {
      alert("El peso debe ser un valor entre 0 y 1");
      return;
    }
    
    // Validar que el nombre del parámetro no esté vacío
    if (parametroEditado.parametro.trim() === "") {
      alert("El nombre del parámetro no puede estar vacío");
      return;
    }
    
    try {
      await updateParametro({
        id: parametroEditado.id,
        parametro: parametroEditado.parametro,
        peso: Number(parametroEditado.peso)
      });
      
      setEditParametroId(null);
    } catch (error: unknown) {
      console.error("Error al actualizar el parámetro:", error);
      alert("Error al guardar los cambios del parámetro. Inténtalo de nuevo.");
    }
  };
  
  // Función para cancelar la edición de un parámetro
  const handleCancelParametroEdit = (): void => {
    // Restaurar el estado original de los parámetros
    if (originalParametros.length > 0) {
      setParametros(originalParametros);
    }
    setEditParametroId(null);
  };
  
  // Función para cambiar valores de un parámetro en edición
  const handleParametroInputChange = (
    parametroId: number,
    field: keyof Omit<Parametro, "id" | "criteriosPriorizacionId">,
    value: string | number,
  ): void => {
    // Si el campo es 'peso', validamos que esté entre 0 y 1
    if (field === 'peso' && typeof value === 'number') {
      // Limitar el valor entre 0 y 1
      value = Math.min(1, Math.max(0, value));
    }

    setParametros(parametros.map(p => 
      p.id === parametroId 
        ? { ...p, [field]: value }
        : p
    ));
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl">Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/parametros">
            <Button variant="ghost">
              Volver
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">
            {currentEje ? `Criterios de Priorización: ${currentEje.eje}` : "Criterios de Priorización"}
          </h1>
        </div>
        <Button onClick={(): void => { void handleAddCriterio(); }}>Agregar Criterio</Button>
      </div>

      <div className="container mx-auto py-6 border border-gray-300 rounded-xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Criterio</TableHead>
              <TableHead>Peso (%)</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {criterios.map((criterio, index) => (
                <Fragment key={`criterio-${criterio.id}`}>
                  <TableRow 
                    className={`cursor-pointer ${expandedRows[criterio.id] ? "bg-gray-100" : ""}`}
                    onClick={(): void => toggleRowExpansion(criterio.id)}
                  >
                    <TableCell className="w-1/2">
                      <div className="flex items-center gap-2">
                        <span className="text-primary">
                          {expandedRows[criterio.id] ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                        </span>
                        {editRowIndex === index ? (
                          <input
                            type="text"
                            value={criterio.criterio}
                            onChange={(e): void =>
                              handleInputChange(
                                index,
                                "criterio",
                                e.target.value,
                              )
                            }
                            className="w-full rounded border px-2 py-1"
                            onClick={(e): void => e.stopPropagation()}
                          />
                        ) : (
                          <span className="text-xl font-semibold sm:text-xl">{criterio.criterio}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="w-1/4">
                      {editRowIndex === index ? (
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="1"
                          value={criterio.peso}
                          onChange={(e): void => {
                            const value = parseFloat(e.target.value);
                            handleInputChange(
                              index,
                              "peso",
                              isNaN(value) ? 0 : value,
                            );
                          }}
                          className="w-full rounded border px-2 py-1"
                          onClick={(e): void => e.stopPropagation()}
                        />
                      ) : (
                        `${criterio.peso}%`
                      )}
                    </TableCell>
                    <TableCell className="w-1/4 text-right" onClick={(e): void => e.stopPropagation()}>
                      <div className="flex justify-end space-x-2">
                        {editRowIndex === index ? (
                          <Button
                            className="rounded px-4 py-2 text-white"
                            onClick={(): void => { void handleSaveClick(index); }}
                          >
                            Guardar
                          </Button>
                        ) : (
                          <Button
                            className="rounded px-4 py-2 text-white"
                            onClick={(e): void => {
                              e.stopPropagation();
                              handleEditClick(index);
                            }}
                          >
                            Editar
                          </Button>
                        )}
                        <Button 
                          variant="destructive"
                          onClick={(e): void => {
                            e.stopPropagation();
                            void handleDeleteClick(criterio.id);
                          }}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  
                  {/* Sección expandible para mostrar los parámetros */}
                  {expandedRows[criterio.id] && (
                    <Fragment key={`parametros-${criterio.id}`}>
                      {/* Encabezado de los parámetros */}
                      <TableRow className="bg-blue-50">
                        <TableCell className="pl-10 font-medium text-blue-800">Parámetro</TableCell>
                        <TableCell className="font-medium text-blue-800">Peso</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            size="sm" 
                            onClick={(e): void => {
                              e.stopPropagation();
                              void handleAddParametro(criterio.id);
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            Agregar Parámetro
                          </Button>
                        </TableCell>
                      </TableRow>
                      
                      {/* Filas de parámetros */}
                      {parametros
                        .filter(parametro => parametro.criteriosPriorizacionId === criterio.id)
                        .map((parametro) => (
                          <TableRow key={`parametro-${parametro.id}`} className="bg-blue-50/70">
                            <TableCell className="pl-10">
                              {editParametroId === parametro.id ? (
                                <input
                                  type="text"
                                  value={parametro.parametro}
                                  onChange={(e): void => 
                                    handleParametroInputChange(
                                      parametro.id,
                                      "parametro",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full rounded border px-2 py-1"
                                  onClick={(e): void => e.stopPropagation()}
                                />
                              ) : (
                                parametro.parametro
                              )}
                            </TableCell>
                            <TableCell>
                              {editParametroId === parametro.id ? (
                                <input
                                  type="number"
                                  min="0"
                                  max="1"
                                  step="0.01"
                                  value={parametro.peso}
                                  onChange={(e): void => {
                                    const value = parseFloat(e.target.value);
                                    handleParametroInputChange(
                                      parametro.id,
                                      "peso",
                                      isNaN(value) ? 0 : value,
                                    );
                                  }}
                                  className="w-full rounded border px-2 py-1"
                                  onClick={(e): void => e.stopPropagation()}
                                />
                              ) : (
                                <span className="text-blue-700 font-medium">{parametro.peso}</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                {editParametroId === parametro.id ? (
                                  <>
                                    <Button 
                                      size="sm" 
                                      className="bg-blue-600 hover:bg-blue-700 text-white"
                                      onClick={(e): void => {
                                        e.stopPropagation();
                                        void handleSaveParametro();
                                      }}
                                    >
                                      Guardar
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={(e): void => {
                                        e.stopPropagation();
                                        handleCancelParametroEdit();
                                      }}
                                    >
                                      Cancelar
                                    </Button>
                                  </>
                                ) : (
                                  <Button 
                                    size="sm" 
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                    onClick={(e): void => {
                                      e.stopPropagation();
                                      handleEditParametro(parametro.id);
                                    }}
                                  >
                                    Editar
                                  </Button>
                                )}
                                <Button 
                                  size="sm" 
                                  variant="destructive" 
                                  onClick={(e): void => {
                                    e.stopPropagation();
                                    void handleDeleteParametro(parametro.id);
                                  }}
                                >
                                  Eliminar
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        
                      {/* Si no hay parámetros, mostrar mensaje */}
                      {parametros.filter(p => p.criteriosPriorizacionId === criterio.id).length === 0 && (
                        <TableRow className="bg-blue-50/70">
                          <TableCell colSpan={3} className="text-center italic text-blue-700">
                            No hay parámetros definidos para este criterio
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  )}
                </Fragment>
              ))}
              
            <TableRow>
              <TableCell className="w-1/2 text-xl font-semibold">Total</TableCell>
              <TableCell className="w-1/4">
                <div className="flex items-center">
                  <span className={`font-medium ${currentEje && calculateTotalWeight() > currentEje.peso ? "text-red-500" : ""}`}>
                    {calculateTotalWeight()}%
                  </span>
                  {currentEje && calculateTotalWeight() !== currentEje.peso && (
                    <span className={`ml-2 text-sm ${calculateTotalWeight() > currentEje.peso ? "text-red-500" : "text-yellow-600"}`}>
                      {calculateTotalWeight() > currentEje.peso 
                        ? `(Excede el peso del eje: ${currentEje.peso}%)`
                        : `(Debe sumar ${currentEje.peso}%)`}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="w-1/4"></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}