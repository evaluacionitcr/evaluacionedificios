"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link"; 
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { getEjes, getCriterios, getParametros } from "./actions";
import { useUploadThing } from "~/utils/uploadthing";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";
import { LoadingSpinnerSVG } from "~/components/ui/svg";

// Interfaces para los tipos de datos
import type { Eje, Criterio, Parametro, ApiResponse, Evaluacion, Sedes } from "../types";

interface StagedFile {
  id: string;
  file: File;
  preview?: string;
}

export default function CrearProyectoPage() {
    // Basic form states
    const [totalGeneral, setTotalGeneral] = useState("");
    const [projectName, setProjectName] = useState("");
    // const [projectDescription, setProjectDescription] = useState(""); // Currently unused
    const [buildingType, setBuildingType] = useState("new"); // "new" or "existing"
    const [selectedBuilding, setSelectedBuilding] = useState("");
    const [depreciacion, setDepreciacion] = useState("");
    const [estadoComponentes, setEstadoComponentes] = useState("");
    const [condicionFuncionalidad, setCondicionFuncionalidad] = useState("");
    
    // Dynamic parameter management
    const [selectedParametros, setSelectedParametros] = useState<Record<string, string>>({});
    const [isInitialized, setIsInitialized] = useState(false);
    
    // Data management for ejes, criterios and parametros
    const [ejes, setEjes] = useState<Eje[]>([]);
    const [criterios, setCriterios] = useState<Criterio[]>([]);
    const [parametros, setParametros] = useState<Parametro[]>([]);
    
    
    // PDF upload states
    const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    // Variable calculada para el puntaje total de edificación existente
    const puntajeEdificacionExistente = buildingType === "existing" 
      ? ((depreciacion ? (parseFloat(depreciacion) * 5) : 0) + 
         (estadoComponentes ? (parseFloat(estadoComponentes) * 10) : 0) +
         (condicionFuncionalidad ? (parseFloat(condicionFuncionalidad) * 20) : 0))
      : 0;
    
    // Estado para controlar si se están cargando los datos
    const [loading, setLoading] = useState(true);
    // Estado para manejar errores de carga
    const [loadError, setLoadError] = useState<string | null>(null);

    // Variables para manejar la evaluación reciente
    const [evaluacionRecientePorCodigo, setEvaluacionRecientePorCodigo] = useState<Record<string, Evaluacion | null>>({});
    const [sedes, setSedes] = useState<Sedes[]>([]);
    const [selectedSede, setSelectedSede] = useState("");
    
    // Cargar datos desde el servidor
    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          setLoadError(null);
          
          // Cargar ejes
          const ejesResult = await getEjes();
          if (ejesResult.success && ejesResult.data) {
            const mappedEjes = ejesResult.data.map(eje => ({
              id: eje.id,
              eje: eje.eje,
              peso: Number(eje.peso)
            }));
            setEjes(mappedEjes);
          } else {
            console.error("Error al cargar ejes:", ejesResult.error);
            setLoadError("Error al cargar ejes de priorización");
            return;
          }
          
          // Cargar criterios
          const criteriosResult = await getCriterios();
          if (criteriosResult.success && criteriosResult.data) {
            const mappedCriterios = criteriosResult.data.map(criterio => ({
              id: criterio.id,
              ejeId: Number(criterio.ejesPriorizacionId), // Ensure it's always a number
              criterio: criterio.criterio,
              peso: Number(criterio.peso),
              ejes_priorizacion_Id: Number(criterio.ejesPriorizacionId)
            }));
            setCriterios(mappedCriterios);
          } else {
            console.error("Error al cargar criterios:", criteriosResult.error);
            setLoadError("Error al cargar criterios de priorización");
            return;
          }
          
          // Cargar parámetros
          const parametrosResult = await getParametros();
          if (parametrosResult.success && parametrosResult.data) {
            const mappedParametros = parametrosResult.data.map(parametro => ({
              id: parametro.id,
              parametro: parametro.parametro,
              peso: Number(parametro.peso),
              criterios_priorizacion_Id: parametro.criteriosPriorizacionId != null ? Number(parametro.criteriosPriorizacionId) : 0
            }));
            setParametros(mappedParametros);
          } else {
            console.error("Error al cargar parámetros:", parametrosResult.error);
            setLoadError("Error al cargar parámetros de priorización");
            return;
          }
        } catch (error) {
          console.error("Error al cargar datos:", error);
          setLoadError("Ocurrió un error al cargar los datos necesarios");
        } finally {
          setLoading(false);
        }
      };
      
      void fetchData();
    }, []);

   

    useEffect(() => {
      async function fetchEvaluaciones() {
        try {
          const response = await fetch("/api/evaluacionesPriorizacion");
          if (!response.ok) {
            throw new Error("Error al obtener evaluaciones");
          }

          const { data } = await response.json() as ApiResponse;

          // data ya contiene solo la evaluación más reciente por edificio
          // Creamos un objeto con el código como key y la evaluación como valor
          const recientes: Record<string, Evaluacion | null> = {};
          for (const evaluacion of data) {
            const codigo = evaluacion.edificio?.codigo;
            if (!codigo) continue;
            recientes[codigo] = evaluacion;
          }
          setEvaluacionRecientePorCodigo(recientes);

        } catch (error) {
          console.error("Error al obtener evaluaciones:", error);
        }
      }

      void fetchEvaluaciones();
    }, []);

    useEffect(() => {
      async function fetchSedes() {
        try {
          const response = await fetch("/api/componentes/sedes");
          if (!response.ok) {
            throw new Error("Error al obtener sedes");
          }

          const data = await response.json() as Sedes[];
          setSedes(data);

        } catch (error) {
          console.error("Error al obtener sedes:", error);
        }
      }

      void fetchSedes();
    }, []);
    
    // Inicializar el estado de parámetros seleccionados
    useEffect(() => {
      if (!loading && criterios.length > 0) {
        const initialSelectedParams: Record<string, string> = {};
        criterios.forEach(criterio => {
          initialSelectedParams[`criterio_${criterio.id}`] = "";
        });
        setSelectedParametros(initialSelectedParams);
        setIsInitialized(true);
      }
    }, [criterios, loading]);
    
    // Función para manejar cambios en los parámetros seleccionados
    const handleParametroChange = (criterioId: number, value: string) => {
      setSelectedParametros(prev => ({
        ...prev,
        [`criterio_${criterioId}`]: value
      }));
    };
    
    // Función para obtener el valor de un parámetro seleccionado
    const getParametroValor = (parametroId: string | undefined): number => {
      if (!parametroId) return 0;
      const parametro = parametros.find(p => p.id.toString() === parametroId);
      return parametro ? parametro.peso : 0;
    };
    
    // Función para calcular el puntaje (valor * peso del criterio)
    const calcularPuntaje = (parametroId: string | undefined, criterioId: number): string => {
      if (!parametroId) return "0.00";
      const parametroValor = getParametroValor(parametroId);
      const criterio = criterios.find(c => c.id === criterioId);
      return criterio ? (parametroValor * criterio.peso).toFixed(2) : "0.00";
    };
    
    // Función para calcular el total de un eje
    const calcularTotalEje = (ejeId: number): string => {
      const criteriosDeEje = criterios.filter(c => c.ejeId === ejeId);
      let total = 0;
      
      criteriosDeEje.forEach(criterio => {
        const criterioKey = `criterio_${criterio.id}`;
        const parametroSeleccionado = selectedParametros[criterioKey];
        if (parametroSeleccionado) {
          total += parseFloat(calcularPuntaje(parametroSeleccionado, criterio.id));
        }
      });
      
      return total.toFixed(2);
    };


      const { startUpload } = useUploadThing("pdfUploader", {
        onUploadBegin() {
          setIsSaving(true);
          toast(
            <div className="flex items-center gap-2">
              <LoadingSpinnerSVG /> <span className="text-lg">Subiendo PDFs...</span>
            </div>,
            {
              duration: 5000,
              id: "uploading-toast",
            },
          );
        },
        onUploadError(_err) {
          toast.dismiss("uploading-toast");
          toast.error("Upload failed. Please try again.");
          setIsSaving(false);
        },
        onClientUploadComplete: (res) => {
          if (res && res.length > 0) {
            setStagedFiles([]); // Clear staged files after successful upload
          }
          setIsSaving(false);
          toast.dismiss("uploading-toast");
          toast.success("PDFs guardados correctamente!");
        },
      });
    
      const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
          'application/pdf': []
        },
        onDrop: (acceptedFiles) => {
          const newStagedFiles = acceptedFiles.map(file => ({
            id: crypto.randomUUID(),
            file,
          }));
          setStagedFiles((prev: StagedFile[]) => [...prev, ...newStagedFiles]);
        }
      });
    
      const handleRemoveStaged = (id: string) => {
        setStagedFiles((files: StagedFile[]) => {
          return files.filter((f: StagedFile) => f.id !== id);
        });
      };

      const handleUploadPDFs = async (projectId: string) => {
        if (stagedFiles.length === 0) return;
        
        setIsSaving(true);
        const files = stagedFiles.map(sf => sf.file);
        await startUpload(files, {
          projectId: projectId,
          description: `PDFs for project: ${projectName}`
        });
      };

    const actualizarValoresEdificio = (codigo: string) => {
        const evaluacion = evaluacionRecientePorCodigo[codigo];
        if (evaluacion) {
          // Actualizar depreciación
          setSelectedBuilding(codigo);
          const depreciacionTotal = evaluacion.depreciacion?.puntajeDepreciacionTotal || 0;
          setDepreciacion(depreciacionTotal.toString());

          // Actualizar estado de componentes
          const puntajeComponentes = evaluacion.puntajeComponentes || 0;
          setEstadoComponentes(puntajeComponentes.toString());

          // Actualizar condición de funcionalidad
          const puntajeServiciabilidad = evaluacion.serviciabilidad?.puntajeServiciabilidad || 0;
          setCondicionFuncionalidad(puntajeServiciabilidad.toString());
        }
    };
    

    
    // Función para el envío del formulario
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate sede selection for new buildings
      if (buildingType === "new" && !selectedSede) {
        alert("Por favor, seleccione una sede para la nueva edificación.");
        return;
      }

      // Construir el objeto para el envío
      const parametrosData: Record<string, Record<string, unknown>> = {};
      
      ejes.forEach(eje => {
      const criteriosDeEje = criterios.filter(c => c.ejeId === eje.id);
      const ejePuntajes: Record<string, {
        id: string;
        valor: number;
        puntaje: string;
        parametroTexto: string;
      } | string> = {};
      
      criteriosDeEje.forEach(criterio => {
        const criterioKey = `criterio_${criterio.id}`;
        const parametroSeleccionado = selectedParametros[criterioKey];
        
        // Si se seleccionó un parámetro para este criterio
        if (parametroSeleccionado) {
        const parametro = parametros.find(p => p.id.toString() === parametroSeleccionado);
        
        ejePuntajes[criterioKey] = {
          id: parametroSeleccionado,
          valor: getParametroValor(parametroSeleccionado),
          puntaje: calcularPuntaje(parametroSeleccionado, criterio.id),
          parametroTexto: parametro?.parametro ?? ""
        };
        } else {
        ejePuntajes[criterioKey] = {
          id: "",
          valor: 0,
          puntaje: "0.00",
          parametroTexto: ""
        };
        }
      });
      
      ejePuntajes.totalPuntaje = calcularTotalEje(eje.id);
      parametrosData[eje.eje.toLowerCase()] = ejePuntajes;
      });
      
      // Construir el objeto completo de datos
      const formData = {
      informacionGeneral: {
        nombre: projectName, 
        descripcion: "", // Description field currently not used in UI 
        tipoEdificacion: buildingType,
        edificioSeleccionado: selectedBuilding,
        nombreEdificio: evaluacionRecientePorCodigo[selectedBuilding]?.edificio?.nombre,
        campusEdificio: evaluacionRecientePorCodigo[selectedBuilding]?.edificio?.campus,
        sede: buildingType === "new" ? selectedSede : undefined
      },        
      edificacionExistente: buildingType === "existing" ? {          
        depreciacion: depreciacion ? parseFloat(depreciacion) : 0,
        estadoComponentes: estadoComponentes ? parseFloat(estadoComponentes) : 0,
        condicionFuncionalidad: condicionFuncionalidad ? parseFloat(condicionFuncionalidad) : 0,
        totalPuntaje: puntajeEdificacionExistente.toFixed(2)
      } : null,
      configuracion: {
        ejes: ejes,
        criterios: criterios,
        parametros: parametros
      },
      evaluacion: parametrosData,
      totalGeneral: totalGeneral
      };

      try {
      setIsSaving(true);
      const response = await fetch("/api/priorizacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("Error al guardar el proyecto");
      }

      const result = await response.json() as { status: string; insertedId?: string; message?: string };
      
      if (result.status === "success" && result.insertedId) {
        // If there are PDFs to upload, upload them with the project ID
        if (stagedFiles.length > 0) {
          await handleUploadPDFs(result.insertedId);
        } else {
          setIsSaving(false);
        }
        
        toast.success("Proyecto guardado exitosamente!");
        window.location.href = "/priorizacion";
      } else {
        throw new Error(result.message ?? "Error al guardar el proyecto");
      }
      } catch (error) {
      toast.error("Ocurrió un error al guardar el proyecto.");
      console.error(error);
      setIsSaving(false);
      }
    };

    

    
    // Componente para renderizar una tabla de eje
    const renderTablaEje = (ejeId: number) => {
      const eje = ejes.find(e => e.id === ejeId);
      if (!eje) return null;
      
      const criteriosDeEje = criterios.filter(c => c.ejeId === ejeId);
      
      return (
        <div key={`eje_${ejeId}`} className="mt-6 border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {eje.eje} ({eje.peso}%)
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded-md">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Criterio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Parámetro</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Valor obtenido</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Peso</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Puntaje</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {criteriosDeEje.length > 0 ? (
                  criteriosDeEje.map((criterio) => (
                    <tr key={criterio.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                        {criterio.criterio}
                      </td>
                      <td className="px-6 py-4">
                        <select 
                          value={selectedParametros[`criterio_${criterio.id}`] ?? ""} 
                          onChange={(e) => handleParametroChange(criterio.id, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Seleccionar parámetro</option>
                          {parametros
                            .filter(p => p.criterios_priorizacion_Id === criterio.id)
                            .map((parametro) => (
                              <option key={parametro.id} value={parametro.id.toString()}>
                                {parametro.parametro}
                              </option>
                            ))
                          }
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {selectedParametros[`criterio_${criterio.id}`] ? 
                          getParametroValor(selectedParametros[`criterio_${criterio.id}`]).toFixed(2) : 
                          "0.00"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">{criterio.peso.toFixed(2)}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {calcularPuntaje(selectedParametros[`criterio_${criterio.id}`], criterio.id)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      [No hay criterios definidos para este eje]
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">No hay parámetros disponibles</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">0.00</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">0.00%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">0.00</td>
                  </tr>
                )}
                
                <tr className="bg-gray-50">
                  <td colSpan={3} className="px-6 py-4 text-right font-medium">Total</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-center">
                    {criteriosDeEje.reduce((sum, criterio) => sum + criterio.peso, 0).toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-center">{calcularTotalEje(ejeId)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Nuevo Proyecto</h1>
          <Link href="/priorizacion">
            <Button variant="outline" className="flex items-center gap-2">
              Volver
            </Button>
          </Link>
        </div>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-6">Información del Proyecto</h2>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center p-10 space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="text-lg text-gray-600">Cargando datos de priorización...</p>
              <p className="text-sm text-gray-500">Por favor espere mientras obtenemos la información necesaria.</p>
            </div>
          ) : loadError ? (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md mb-6 flex flex-col items-center">
              <div className="text-lg font-medium mb-2">Error al cargar datos</div>
              <p className="text-center">{loadError}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.location.reload()}>
                Intentar nuevamente
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="projectName" className="text-base font-medium text-gray-700">Nombre del Proyecto</label>
                <input
                  id="projectName"
                  placeholder="Ingrese el nombre del proyecto"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                  className="w-full h-11 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-base font-medium text-gray-700">Tipo de Edificación</label>
                <div className="flex space-x-8 mt-2">
                  <div className="flex items-center">
                    <input
                      id="building-new"
                      type="radio"
                      name="buildingType"
                      value="new"
                      checked={buildingType === "new"}
                      onChange={() => setBuildingType("new")}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor="building-new" className="ml-2 text-base text-gray-700">
                      Edificación Nueva
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="building-existing"
                      type="radio"
                      name="buildingType"
                      value="existing"
                      checked={buildingType === "existing"}
                      onChange={() => setBuildingType("existing")}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor="building-existing" className="ml-2 text-base text-gray-700">
                      Edificación Existente
                    </label>
                  </div>
                </div>
              </div>
              
              {buildingType === "new" && (
                <>
                  <div className="mt-6 border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Nueva Edificación</h3>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <label htmlFor="sede" className="text-base font-medium text-gray-700">Sede</label>
                    <Select value={selectedSede} onValueChange={setSelectedSede}>
                      <SelectTrigger id="sede" className="w-full h-11">
                        <SelectValue placeholder="Seleccionar sede" />
                      </SelectTrigger>
                      <SelectContent>
                        {sedes.length > 0 ? 
                          sedes.map((sede) => (
                            <SelectItem key={sede.idSede} value={sede.nombre}>
                              {sede.nombre}
                            </SelectItem>
                          ))
                         : 
                          <SelectItem key="no-sedes" disabled value="">No hay sedes disponibles</SelectItem>
                        }
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full border rounded-md">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Criterio</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Criterio seleccionado</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Valor obtenido</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Peso</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Puntaje</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600 bg-red-100">No hay posibilidad de reacondicionar edificio existente</td>
                          <td className="px-6 py-4 whitespace-nowrap"></td>
                          <td className="px-6 py-4 whitespace-nowrap"></td>
                          <td className="px-6 py-4 whitespace-nowrap"></td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600 bg-red-100">Se cuenta con viabilidad ambiental</td>
                          <td className="px-6 py-4 whitespace-nowrap"></td>
                          <td className="px-6 py-4 whitespace-nowrap"></td>
                          <td className="px-6 py-4 whitespace-nowrap"></td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600 bg-red-100">Es requerido para mejorar el servicio</td>
                          <td className="px-6 py-4 whitespace-nowrap"></td>
                          <td className="px-6 py-4 whitespace-nowrap"></td>
                          <td className="px-6 py-4 whitespace-nowrap"></td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td colSpan={3} className="px-6 py-4 text-right font-medium">Total</td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium">0%</td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium">0%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  </>
              )}

              {buildingType === "existing" && (
                <>
                  <div className="mt-6 border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Valoración Edificación Existente</h3>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <label htmlFor="building" className="text-base font-medium text-gray-700">Edificio</label>
                    <Select value={selectedBuilding} onValueChange={(codigo) => actualizarValoresEdificio(codigo)}>
                      <SelectTrigger id="building" className="w-full h-11">
                        <SelectValue placeholder="Seleccionar edificio" />
                      </SelectTrigger>
                      <SelectContent>
                      {Object.keys(evaluacionRecientePorCodigo).length > 0 ? (
                        Object.entries(evaluacionRecientePorCodigo).map(([codigo, evaluacion]) =>
                          evaluacion ? (
                            <SelectItem key={evaluacion._id} value={codigo}>
                              {evaluacion.edificio?.nombre || codigo}
                            </SelectItem>
                          ) : null
                        )
                      ) : (
                        <SelectItem key="no-edificios" disabled value={""}>No hay edificios disponibles</SelectItem>
                      )}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full border rounded-md">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Criterio</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Criterio seleccionado</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Valor obtenido</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Peso</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Puntaje</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 bg-yellow-100">Depreciación del edificio</td>
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              min="0.00"
                              step="0.01"
                              placeholder="0-1"
                              readOnly
                              value={depreciacion}
                              onChange={(e) => setDepreciacion(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </td>                          
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {depreciacion ? parseFloat(depreciacion).toFixed(2) : "0.00"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">5%</td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {depreciacion ? (parseFloat(depreciacion) * 5).toFixed(2) : "0.00"}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 bg-yellow-100">Estados de los componentes y sistemas</td>
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              min="0.00"
                              readOnly
                              step="0.01"
                              placeholder="0-1"
                              value={estadoComponentes}
                              onChange={(e) => setEstadoComponentes(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </td>                          
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {estadoComponentes ? parseFloat(estadoComponentes).toFixed(2) : "0.00"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">10%</td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {estadoComponentes ? (parseFloat(estadoComponentes) * 10).toFixed(2) : "0.00"}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 bg-yellow-100">Condición de funcionalidad y normativa del edificio</td>
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              min="0.00"
                              readOnly
                              step="0.01"
                              placeholder="0-1"
                              value={condicionFuncionalidad}
                              onChange={(e) => setCondicionFuncionalidad(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </td>                          
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {condicionFuncionalidad ? parseFloat(condicionFuncionalidad).toFixed(2) : "0.00"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">20%</td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {condicionFuncionalidad ? (parseFloat(condicionFuncionalidad) * 20).toFixed(2) : "0.00"}
                          </td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td colSpan={3} className="px-6 py-4 text-right font-medium">Total</td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-center">35%</td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-center">
                            {puntajeEdificacionExistente.toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </>
              )}
              
              {/* Componente para renderizar una tabla de eje */}
              {isInitialized && (
                <>
                  
                  
                  {/* Tablas de ejes */}
                  {ejes.map(eje => renderTablaEje(eje.id))}

                  {/* Tabla de Total General */}
                  <div className="mt-8 border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Resumen Total del Proyecto
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border rounded-md">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Componente</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Peso</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Puntaje Obtenido</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {/* Filas para los ejes */}
                          {ejes.map(eje => (
                            <tr key={`total_${eje.id}`}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                                {eje.eje}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                {eje.peso}%
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                {calcularTotalEje(eje.id)}
                              </td>
                            </tr>
                          ))}
                          
                          {/* Fila para edificación existente o nueva */}
                          {buildingType === "existing" ? (
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 bg-yellow-50">
                                Edificación Existente
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center bg-yellow-50">
                                35%
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center bg-yellow-50">
                                {puntajeEdificacionExistente.toFixed(2)}
                              </td>
                            </tr>
                          ) : (
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 bg-blue-50">
                                Edificación Nueva
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center bg-blue-50">
                                0%
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center bg-blue-50">
                                0.00
                              </td>
                            </tr>
                          )}
                          
                          {/* Fila del total general */}
                          <tr className="bg-blue-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                              TOTAL GENERAL
                            </td>                            
                            <td className="px-6 py-4 whitespace-nowrap text-center font-medium">
                              {ejes.reduce((sum, eje) => sum + eje.peso, 0) + (buildingType === "existing" ? 35 : 0)}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center font-medium text-blue-600">
                              {(() => {
                                const total = ejes.reduce((sum, eje) => sum + parseFloat(calcularTotalEje(eje.id)), 0) +
                                  (buildingType === "existing" ? puntajeEdificacionExistente : 0);
                                if (totalGeneral !== total.toFixed(2)) setTotalGeneral(total.toFixed(2));
                                return total.toFixed(2);
                              })()}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="mt-6 border-t pt-6">
                    <h2 className="mb-4 text-xl font-semibold">
                      Documentos del Proyecto (PDFs)
                    </h2>
          
                    <div {...getRootProps()} className={`mb-4 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}>
                      <input {...getInputProps()} />
                      <div className="flex flex-col items-center">
                        <Upload className="h-12 w-12 text-gray-400 mb-2" />
                        {isDragActive ? (
                          <p>Suelta los archivos PDF aquí ...</p>
                        ) : (
                          <p>Arrastra y suelta archivos PDF aquí, o haz clic para seleccionar</p>
                        )}
                      </div>
                    </div>
          
                    {/* Staged PDFs */}
                    {stagedFiles.length > 0 && (
                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-lg font-medium">
                            PDFs seleccionados ({stagedFiles.length})
                          </h3>
                          <p className="text-sm text-gray-600">
                            Los PDFs se subirán cuando guardes el proyecto
                          </p>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {stagedFiles.map((file) => (
                            <div key={file.id} className="group relative overflow-hidden rounded-md border p-4">
                              <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                  <Upload className="h-8 w-8 text-red-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {file.file.name}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {(file.file.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveStaged(file.id)}
                                className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
              <div className="flex justify-end space-x-3 pt-4">
                <Link href="/priorizacion">
                  <Button variant="outline" className="px-6" disabled={isSaving}>Cancelar</Button>
                </Link>
                <Button type="submit" className="px-6" disabled={isSaving}>
                  {isSaving ? "Guardando..." : "Guardar Proyecto"}
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    );
}
