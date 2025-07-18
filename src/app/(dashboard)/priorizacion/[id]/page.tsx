"use client";
import { useState, useEffect, use } from "react";
import Link from "next/link"; 
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { getEjes, getCriterios, getParametros } from "../crearProyecto/actions";
import { Download, FileText, ExternalLink } from "lucide-react";

// Interfaces para los tipos de datos
import type { Eje, Criterio, Parametro, FormularioProyecto, ApiResponse, Evaluacion, Sedes } from "../types";

interface DocumentoProyecto {
  _id: string;
  name: string;
  url: string;
  description: string;
  projectId: string;
  userId: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export default function VerProyectoPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    const [totalGeneral, setTotalGeneral] = useState("");
    const [projectName, setProjectName] = useState("");
    // const [_projectDescription, setProjectDescription] = useState("");
    const [buildingType, setBuildingType] = useState("new"); // "new" or "existing"
    
    // PDF state management
    const [documentos, setDocumentos] = useState<DocumentoProyecto[]>([]);
    const [loadingDocumentos, setLoadingDocumentos] = useState(false);
    const [documentosError, setDocumentosError] = useState<string | null>(null);
    
    // Cargar datos del proyecto
    useEffect(() => {
      const fetchProyecto = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/priorizacion/${id}`);
          
          if (!response.ok) {
            throw new Error("Error al obtener el proyecto");
          }

          const proyecto = await response.json() as { data: FormularioProyecto };
          
          // Actualizar estados con la información del proyecto
          setProjectName(proyecto.data.informacionGeneral.nombre);
          // setProjectDescription(proyecto.data.informacionGeneral.descripcion);
          setBuildingType(proyecto.data.informacionGeneral.tipoEdificacion);
          setSelectedBuilding(proyecto.data.informacionGeneral.edificioSeleccionado ?? "");
          setSelectedSede(proyecto.data.informacionGeneral.sede ?? "");
          setTotalGeneral(proyecto.data.totalGeneral.toString());
          
          // Si es edificación existente, establecer los valores
          if (proyecto.data.edificacionExistente) {
            setDepreciacion(proyecto.data.edificacionExistente.depreciacion?.toString() ?? "0");
            setEstadoComponentes(proyecto.data.edificacionExistente.estadoComponentes?.toString() ?? "0");
            setCondicionFuncionalidad(proyecto.data.edificacionExistente.condicionFuncionalidad?.toString() ?? "0");
          }

          // Establecer los parámetros seleccionados 
          const parametrosSeleccionados: Record<string, string> = {};
          if (proyecto.data.evaluacion) {
            Object.entries(proyecto.data.evaluacion).forEach(([_eje, datos]) => {
              if (datos && typeof datos === 'object') {
                Object.entries(datos).forEach(([criterioKey, valor]) => {
                  if (criterioKey !== 'totalPuntaje' && valor && typeof valor === 'object' && 'id' in valor) {
                    parametrosSeleccionados[criterioKey] = String(valor.id);
                  }
                });
              }
            });
          }
          setSelectedParametros(parametrosSeleccionados);
          
        } catch (error) {
          console.error("Error al cargar el proyecto:", error);
          setLoadError("Error al cargar los datos del proyecto");
        } finally {
          setLoading(false);
        }
      };

      void fetchProyecto();
    }, [id]);

    // Fetch PDFs from API
    const fetchDocumentos = async () => {
      try {
        setLoadingDocumentos(true);
        setDocumentosError(null);
        
        const response = await fetch(`/api/priorizacion/${id}/documentos`);
        
        if (!response.ok) {
          throw new Error("Error al cargar los documentos");
        }
        
        const result = await response.json() as { status: string; data: DocumentoProyecto[]; message?: string };
        
        if (result.status === "success") {
          setDocumentos(result.data);
        } else {
          throw new Error(result.message ?? "Error al cargar los documentos");
        }
      } catch (error) {
        console.error("Error al cargar documentos:", error);
        setDocumentosError(error instanceof Error ? error.message : "Error desconocido");
        setDocumentos([]);
      } finally {
        setLoadingDocumentos(false);
      }
    };

    // Handle PDF download
    const handleDownload = async (documento: DocumentoProyecto) => {
      try {
        const response = await fetch(documento.url);
        const blob = await response.blob();
        
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = documento.name;
        document.body.appendChild(link);
        link.click();
        
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error al descargar el archivo:", error);
      }
    };

    // Handle PDF view in new tab
    const handleView = (documento: DocumentoProyecto) => {
      window.open(documento.url, '_blank');
    };

    // Fetch PDFs when component loads
    useEffect(() => {
      void fetchDocumentos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);
    const [selectedBuilding, setSelectedBuilding] = useState("");
    const [depreciacion, setDepreciacion] = useState("");
    const [estadoComponentes, setEstadoComponentes] = useState("");
    const [condicionFuncionalidad, setCondicionFuncionalidad] = useState("");
  // Estado para manejar dinámicamente los parámetros seleccionados
    const [selectedParametros, setSelectedParametros] = useState<Record<string, string>>({});
    // Estado para controlar si la inicialización se ha completado
    const [isInitialized, setIsInitialized] = useState(false);
    // Estados para la gestión de ejes, criterios y parámetros
    const [ejes, setEjes] = useState<Eje[]>([]);
    const [criterios, setCriterios] = useState<Criterio[]>([]);
    const [parametros, setParametros] = useState<Parametro[]>([]);
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
    // Estados para el manejo de formularios de nuevos elementos (no usados en vista de solo lectura)
    
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
      if (!loading && criterios.length > 0 && Object.keys(selectedParametros).length === 0) {
        // Solo inicializar si no hay parámetros seleccionados
        const initialSelectedParams: Record<string, string> = {};
        criterios.forEach(criterio => {
          initialSelectedParams[`criterio_${criterio.id}`] = "";
        });
        setSelectedParametros(initialSelectedParams);
        setIsInitialized(true);
      } else if (!loading && criterios.length > 0) {
        // Si hay datos cargados y criterios disponibles, marcar como inicializado
        setIsInitialized(true);
      }
    }, [criterios, loading, selectedParametros]);
    
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
    
    // Componente para renderizar una tabla de eje
    const renderTablaEje = (ejeId: number) => {
      const eje = ejes.find(e => e.id === ejeId);
      if (!eje) return null;
      
      const criteriosDeEje = criterios.filter(c => c.ejeId === ejeId);
      
      return (
        <div className="mt-6 border-t pt-6">
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
                    <tr key={`criterio-${criterio.id}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                        {criterio.criterio}
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                          {(() => {
                            const parametroId = selectedParametros[`criterio_${criterio.id}`];
                            if (!parametroId) return "No seleccionado";
                            const parametro = parametros.find(p => p.id.toString() === parametroId);
                            return parametro ? parametro.parametro : "No seleccionado";
                          })()}
                        </div>
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
          <h1 className="text-2xl font-bold">Ver Proyecto</h1>
          <Link href="/priorizacion">
            <Button variant="outline" className="flex items-center gap-2">
              Volver
            </Button>
          </Link>
        </div>
        
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
                  value={projectName}
                  readOnly
                  className="w-full h-11 px-4 bg-gray-50 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-base font-medium text-gray-700">Tipo de Edificación</label>
                <div className="flex space-x-8 mt-2">
                  <div className="flex items-center">
                    <input
                      id="building-new"
                      type="radio"
                      disabled
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
                      disabled
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
                    <Select disabled value={selectedSede} onValueChange={setSelectedSede}>
                      <SelectTrigger id="sede" className="w-full h-11">
                        <SelectValue placeholder="Seleccionar sede" />
                      </SelectTrigger>
                      <SelectContent>{sedes.length > 0 ? 
                        sedes.map((sede) => (
                          <SelectItem 
                            key={`sede-${sede.idSede || sede.nombre}`} 
                            value={sede.nombre || '_no_value_'}
                          >{sede.nombre}</SelectItem>
                        )) : 
                        <SelectItem key="no-sedes" value="_no_sedes_">No hay sedes disponibles</SelectItem>
                      }</SelectContent>
                    </Select>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full border rounded-md"><thead className="bg-gray-50"><tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Criterio</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Criterio seleccionado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Valor obtenido</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Peso</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Puntaje</th>
                    </tr></thead><tbody className="bg-white divide-y divide-gray-200"><tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 bg-yellow-100">Depreciación del edificio</td>
                      <td className="px-6 py-4">
                        <input type="number" min="0.00" step="0.01" placeholder="0-1" readOnly 
                          value={depreciacion}
                          onChange={(e) => setDepreciacion(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">{depreciacion ? parseFloat(depreciacion).toFixed(2) : "0.00"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">5%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">{depreciacion ? (parseFloat(depreciacion) * 5).toFixed(2) : "0.00"}</td>
                    </tr><tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 bg-yellow-100">Estados de los componentes y sistemas</td>
                      <td className="px-6 py-4">
                        <input type="number" min="0.00" readOnly step="0.01" placeholder="0-1" 
                          value={estadoComponentes}
                          onChange={(e) => setEstadoComponentes(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">{estadoComponentes ? parseFloat(estadoComponentes).toFixed(2) : "0.00"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">10%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">{estadoComponentes ? (parseFloat(estadoComponentes) * 10).toFixed(2) : "0.00"}</td>
                    </tr></tbody></table>
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
                    <Select disabled value={selectedBuilding} onValueChange={(codigo) => actualizarValoresEdificio(codigo)}>
                      <SelectTrigger id="building" className="w-full h-11">
                        <SelectValue placeholder="Seleccionar edificio" />
                      </SelectTrigger>
                      <SelectContent>{Object.keys(evaluacionRecientePorCodigo).length > 0 ? 
                        Object.entries(evaluacionRecientePorCodigo).map(([codigo, evaluacion]) =>
                          evaluacion ? (
                            <SelectItem key={`building-${evaluacion._id}`} value={codigo || '_no_value_'}>
                              {evaluacion.edificio?.nombre || codigo}
                            </SelectItem>
                          ) : null
                        ) : 
                        <SelectItem key="no-buildings" value="_no_buildings_">No hay edificios disponibles</SelectItem>
                      }</SelectContent>
                    </Select>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full border rounded-md"><thead className="bg-gray-50"><tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Criterio</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Criterio seleccionado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Valor obtenido</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Peso</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Puntaje</th>
                    </tr></thead><tbody className="bg-white divide-y divide-gray-200">
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
                  <div>
                    {ejes.map(eje => (
                      <div key={`eje-${eje.id}`}>
                        {renderTablaEje(eje.id)}
                      </div>
                    ))}
                  </div>

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
                          {ejes.map(eje => (
                            <tr key={`total_${eje.id}`}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{eje.eje}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">{eje.peso}%</td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">{calcularTotalEje(eje.id)}</td>
                            </tr>
                          ))}
                          {buildingType === "existing" ? (
                            <tr key="existing-building">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 bg-yellow-50">Edificación Existente</td>
                              <td className="px-6 py-4 whitespace-nowrap text-center bg-yellow-50">35%</td>
                              <td className="px-6 py-4 whitespace-nowrap text-center bg-yellow-50">{puntajeEdificacionExistente.toFixed(2)}</td>
                            </tr>
                          ) : (
                            <tr key="new-building">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 bg-blue-50">Edificación Nueva</td>
                              <td className="px-6 py-4 whitespace-nowrap text-center bg-blue-50">0%</td>
                              <td className="px-6 py-4 whitespace-nowrap text-center bg-blue-50">0.00</td>
                            </tr>
                          )}
                          <tr key="total-general">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">TOTAL GENERAL</td>
                            <td className="px-6 py-4 whitespace-nowrap text-center font-medium">{ejes.reduce((sum, eje) => sum + eje.peso, 0) + (buildingType === "existing" ? 35 : 0)}%</td>
                            <td className="px-6 py-4 whitespace-nowrap text-center font-medium text-blue-600">{(() => {
                              const total = ejes.reduce((sum, eje) => sum + parseFloat(calcularTotalEje(eje.id)), 0) +
                                (buildingType === "existing" ? puntajeEdificacionExistente : 0);
                              if (totalGeneral !== total.toFixed(2)) setTotalGeneral(total.toFixed(2));
                              return total.toFixed(2);
                            })()}</td>
                          </tr>
                        </tbody></table>
                    </div>
                  </div>
                </>
              )}
              
              {/* Sección de documentos PDF */}
              <div className="mt-8 border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Documentos del Proyecto</h3>
                
                {loadingDocumentos ? (
                  <div className="flex items-center justify-center p-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span className="ml-2 text-gray-600">Cargando documentos...</span>
                  </div>
                ) : documentosError ? (
                  <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md">
                    <p>{documentosError}</p>
                  </div>
                ) : documentos.length === 0 ? (
                  <div className="bg-gray-50 border border-gray-200 text-gray-600 p-6 rounded-md text-center">
                    <FileText className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p>No hay documentos disponibles para este proyecto.</p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {documentos.map((documento) => (
                      <div
                        key={documento._id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start space-x-3">
                          <FileText className="h-8 w-8 text-red-500 flex-shrink-0 mt-1" />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {documento.name}
                            </h4>
                            {documento.description && (
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                {documento.description}
                              </p>
                            )}
                            <div className="flex items-center space-x-2 mt-3">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleView(documento)}
                                className="flex items-center space-x-1"
                              >
                                <ExternalLink className="h-3 w-3" />
                                <span>Ver</span>
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleDownload(documento)}
                                className="flex items-center space-x-1"
                              >
                                <Download className="h-3 w-3" />
                                <span>Descargar</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
            </div>
            
          )}
        
      </div>
    );
}
