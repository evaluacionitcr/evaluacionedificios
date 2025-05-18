"use client";
import { Fragment, useEffect, useState } from "react";
import Link from "next/link"; 
import { Button } from "~/components/ui/button";
import { useParams } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { ChevronDown, ChevronRight } from "lucide-react";

interface Eje {
  id: number;
  eje: string;
  peso: number;
}

interface Criterio {
  id: number;
  idEje: number;
  criterio: string;
  peso: number;
}

interface Parametros {
  id: number;
  idCriterio: number;
  parametro: string;
  peso: number;
}

export default function Page() {
  const [ejes, setEjes] = useState<Eje[]>([
    { id: 1, eje: "FUNCIONAL", peso: 40 },
  ]);
  const [criterios, setCriterios] = useState<Criterio[]>([
    { id: 1, idEje: 1, criterio: "Criterio 1", peso: 20 },
    { id: 2, idEje: 1, criterio: "Criterio 2", peso: 30 },
  ]);
  const [parametros, setParametros] = useState<Parametros[]>([
    { id: 1, idCriterio: 1, parametro: "Parametro 1", peso: 0.1 },
    { id: 2, idCriterio: 1, parametro: "Parametro 2", peso: 0.1 },
    { id: 3, idCriterio: 2, parametro: "Parametro 3", peso: 0.15 },
    { id: 4, idCriterio: 2, parametro: "Parametro 4", peso: 0.15 },
  ]);  
  const [editRowIndex, setEditRowIndex] = useState<number | null>(null);  const [editParametroId, setEditParametroId] = useState<number | null>(null);
  const [currentEje, setCurrentEje] = useState<Eje | null>(null);
  const [originalParametros, setOriginalParametros] = useState<Parametros[]>([]);
  // Estado para controlar las filas expandidas
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
    // Buscar el eje actual basado en el ID de la URL  
  const params = useParams();
  const ejeId = params.id ? Number(params.id) : null;
  
  useEffect(() => {
    if (ejeId) {
      const foundEje = ejes.find(eje => eje.id === ejeId);
      if (foundEje) {
        setCurrentEje(foundEje);
      }
    } else if (ejes.length > 0) {
      const firstEje = ejes[0];
      if (firstEje) {
        setCurrentEje(firstEje);
      }
    }
  }, [ejes, ejeId]);

  const handleEditClick = (index: number) => {
    setEditRowIndex(index);
  };

  const handleInputChange = (
    index: number,
    field: keyof Omit<Criterio, "id" | "idEje">,
    value: string | number,
  ) => {
    const updatedData = [...criterios];
    const currentRow = updatedData[index];
    if (currentRow) {
      updatedData[index] = {
        ...currentRow,
        [field]: value,
      };
      setCriterios(updatedData);
    }
  };
  const handleSaveClick = (index: number) => {
    // Validar que el nombre del criterio no esté vacío
    if (!criterios[index] || criterios[index].criterio.trim() === "") {
      alert("El nombre del criterio no puede estar vacío");
      return;
    }
    
    // Validar que el peso sea un número válido
    if (isNaN(criterios[index].peso)) {
      alert("El peso debe ser un valor numérico válido");
      return;
    }
    
    // Verificar que el peso total no exceda el peso del eje
    const totalPeso = calculateTotalWeight();
    if (currentEje && totalPeso > currentEje.peso) {
      alert(`El peso total de los criterios (${totalPeso}%) excede el peso del eje (${currentEje.peso}%)`);
      return;
    }
    
    // Aquí se implementaría la lógica para guardar en la API
    setEditRowIndex(null);
  };

  const handleDeleteClick = (id: number) => {
    setCriterios((prevData) => prevData.filter((criterio) => criterio.id !== id));
  };

  const handleAddCriterio = () => {
    if (!currentEje) return;
    
    const newId = criterios.length > 0 ? Math.max(...criterios.map(criterio => criterio.id)) + 1 : 1;
    const newCriterio: Criterio = {
      id: newId,
      idEje: currentEje.id,
      criterio: "Nuevo Criterio",
      peso: 0,
    };
    setCriterios([...criterios, newCriterio]);
  };  const calculateTotalWeight = (): number => {
    return criterios
      .filter(criterio => currentEje && criterio.idEje === currentEje.id)
      .reduce((total, row) => total + (row.peso || 0), 0);
  };
  
  // Calcular el peso total de los parámetros para un criterio específico
  const calculateParametrosTotalWeight = (criterioId: number): number => {
    return parametros
      .filter(parametro => parametro.idCriterio === criterioId)
      .reduce((total, parametro) => total + (parametro.peso || 0), 0);
  };
  // Función para alternar el estado expandido/colapsado de una fila
  const toggleRowExpansion = (criterioId: number) => {
    // Si estamos cerrando la fila que contiene un parámetro en edición, salimos del modo edición
    if (expandedRows[criterioId] && editParametroId !== null) {
      // Verificamos si el parámetro en edición pertenece a este criterio
      const parametroEnEdicion = parametros.find(p => p.id === editParametroId);
      if (parametroEnEdicion && parametroEnEdicion.idCriterio === criterioId) {
        setEditParametroId(null);
      }
    }
    
    setExpandedRows((prev) => ({
      ...prev,
      [criterioId]: !prev[criterioId],
    }));
  };
    // Función para añadir un nuevo parámetro a un criterio
  const handleAddParametro = (criterioId: number) => {
    // Encontrar el criterio correspondiente
    const criterio = criterios.find(c => c.id === criterioId);
    if (!criterio) return;
    
    // Calcular el peso actual de todos los parámetros del criterio
    const pesoActual = calculateParametrosTotalWeight(criterioId);
    
    // Calcular el peso disponible
    const pesoDisponible = criterio.peso - pesoActual;
    
    const newId = parametros.length > 0 ? Math.max(...parametros.map(p => p.id)) + 1 : 1;
    const newParametro = {
      id: newId,
      idCriterio: criterioId,
      parametro: "Nuevo Parámetro",
      peso: pesoDisponible > 0 ? pesoDisponible : 0
    };
    
    const newParametros = [...parametros, newParametro];
    setParametros(newParametros);
    
    // Iniciar edición del nuevo parámetro
    setOriginalParametros(parametros);
    setEditParametroId(newId);
  };
    // Función para eliminar un parámetro
  const handleDeleteParametro = (parametroId: number) => {
    setParametros(parametros.filter(p => p.id !== parametroId));
  };
    // Función para iniciar la edición de un parámetro
  const handleEditParametro = (parametroId: number) => {
    // Guardar el estado original de los parámetros antes de editar
    setOriginalParametros([...parametros]);
    setEditParametroId(parametroId);
  };
    
  // Función para guardar cambios en un parámetro
  const handleSaveParametro = () => {
    // Aquí se podría implementar la lógica para guardar en la API
    if (editParametroId !== null) {
      const parametroEditado = parametros.find(p => p.id === editParametroId);
      if (parametroEditado) {
        // Validar que el peso sea un número válido
        if (isNaN(parametroEditado.peso)) {
          alert("El peso debe ser un valor numérico válido");
          return;
        }
        
        // Validar que el nombre del parámetro no esté vacío
        if (parametroEditado.parametro.trim() === "") {
          alert("El nombre del parámetro no puede estar vacío");
          return;
        }
      }
    }
    
    setEditParametroId(null);
  };
  
  // Función para cancelar la edición de un parámetro
  const handleCancelParametroEdit = () => {
    // Restaurar el estado original de los parámetros
    if (originalParametros.length > 0) {
      setParametros(originalParametros);
    }
    setEditParametroId(null);
  };
  
  // Función para cambiar valores de un parámetro en edición
  const handleParametroInputChange = (
    parametroId: number,
    field: keyof Omit<Parametros, "id" | "idCriterio">,
    value: string | number,
  ) => {
    setParametros(parametros.map(p => 
      p.id === parametroId 
        ? { ...p, [field]: value }
        : p
    ));
  };

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
        <Button onClick={handleAddCriterio}>Agregar Criterio</Button>
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
          <TableBody>            {criterios
              .filter(criterio => currentEje && criterio.idEje === currentEje.id)
              .map((criterio, index) => (
                <>
                  <TableRow 
                    key={criterio.id} 
                    className={`cursor-pointer ${expandedRows[criterio.id] ? "bg-gray-100" : ""}`}
                    onClick={() => toggleRowExpansion(criterio.id)}
                  >
                    <TableCell className="w-1/2">                      <div className="flex items-center gap-2">
                        <span className="text-primary">
                          {expandedRows[criterio.id] ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                        </span>
                        {editRowIndex === index ? (
                          <input
                            type="text"
                            value={criterio.criterio}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "criterio",
                                e.target.value,
                              )
                            }
                            className="w-full rounded border px-2 py-1"
                            onClick={(e) => e.stopPropagation()}
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
                          value={criterio.peso}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            handleInputChange(
                              index,
                              "peso",
                              isNaN(value) ? 0 : value,
                            );
                          }}
                          className="w-full rounded border px-2 py-1"
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        `${criterio.peso}%`
                      )}
                    </TableCell>
                    <TableCell className="w-1/4 text-right" onClick={(e) => e.stopPropagation()}>
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
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(index);
                            }}
                          >
                            Editar
                          </Button>
                        )}
                        <Button 
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(criterio.id);
                          }}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  
                  {/* Sección expandible para mostrar los parámetros */}
                  {expandedRows[criterio.id] && (
                    <>                      {/* Encabezado de los parámetros */}
                      <TableRow className="bg-blue-50">
                        <TableCell className="pl-10 font-medium text-blue-800">Parámetro</TableCell>
                        <TableCell className="font-medium text-blue-800">Peso</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddParametro(criterio.id);
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            Agregar Parámetro
                          </Button>
                        </TableCell>
                      </TableRow>
                        {/* Filas de parámetros */}
                      {parametros
                        .filter(parametro => parametro.idCriterio === criterio.id)
                        .map((parametro) => (
                          <TableRow key={parametro.id} className="bg-blue-50/70">
                            <TableCell className="pl-10">
                              {editParametroId === parametro.id ? (
                                <input
                                  type="text"
                                  value={parametro.parametro}
                                  onChange={(e) => 
                                    handleParametroInputChange(
                                      parametro.id,
                                      "parametro",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full rounded border px-2 py-1"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              ) : (
                                parametro.parametro
                              )}
                            </TableCell>
                            <TableCell>
                              {editParametroId === parametro.id ? (
                                <input
                                  type="number"
                                  value={parametro.peso}
                                  onChange={(e) => {
                                    const value = parseFloat(e.target.value);
                                    handleParametroInputChange(
                                      parametro.id,
                                      "peso",
                                      isNaN(value) ? 0 : value,
                                    );
                                  }}
                                  className="w-full rounded border px-2 py-1"
                                  onClick={(e) => e.stopPropagation()}
                                />                              ) : (
                                <span className="text-blue-700 font-medium">{parametro.peso}</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">                                {editParametroId === parametro.id ? (
                                  <>
                                    <Button 
                                      size="sm" 
                                      className="bg-blue-600 hover:bg-blue-700 text-white"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSaveParametro();
                                      }}
                                    >
                                      Guardar
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={(e) => {
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
                                    onClick={(e) => {
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
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteParametro(parametro.id);
                                  }}
                                >
                                  Eliminar
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}                        {/* Si no hay parámetros, mostrar mensaje */}
                      {parametros.filter(p => p.idCriterio === criterio.id).length === 0 && (
                        <TableRow className="bg-blue-50/70">
                          <TableCell colSpan={3} className="text-center italic text-blue-700">
                            No hay parámetros definidos para este criterio
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  )}
                </>
              ))}            <TableRow>
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