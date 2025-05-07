"use client";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { getComponentes, getEstadoConservacion, getFuncionalidades, getNormativas, guardarEvaluacion } from "./actions";
import BuildingInfoSection from "./components/BuildingInfoSection";
import DepreciationSection from "./components/DepreciationSection";
import ComponentsTable from "./components/ComponentsTable";
import ServiceabilitySection from "./components/ServiceabilitySection";
import TotalScoreTable from "./components/TotalScoreTable";
import CommentsSection from "./components/CommentsSection";
import { useRouter } from "next/navigation";
import { ArrowLeft, X, Upload } from "lucide-react";
import { useDropzone } from 'react-dropzone';
import { useUploadThing } from "~/utils/uploadthing";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";

interface Componente {
  id: number;
  componente: string;
  peso: number;
  necesidadIntervencion: number;
  existencia: string;
  pesoEvaluado?: number;
  puntaje?: number;
  elementosValorar?: string;
}

interface EstadoConservacion {
  id: number;
  estado_conservacion: string;
  condiciones_fisicas: string;
  clasificacion: string;
  coef_depreciacion: number;
}

interface Funcionalidad {
  id: number;
  Estado: string;
  Puntuacion: number;
  Descripcion: string;
}

interface Normativa {
  id: number;
  Estado: string;
  Puntuacion: number;
  Descripcion: string;
}

interface Comentarios {
  funcionalidad: string;
  normativa: string;
  componentesCriticos: string;
  mejorasRequeridas: string;
}

interface UploadedImage {
  id: string;
  name: string;
  url: string;
}

interface StagedFile {
  id: string;
  file: File;
  preview: string;
}

interface EdificioResponse {
  edad?: number;
  vidaUtilExperto?: number;
  codigoEdificio?: string;
  nombre?: string;
  usoActualDescripcion?: string;
  m2Construccion?: number;
  sedeNombre?: string;
}

interface ComponenteResponse {
  id: number;
  componente: string;
  peso: string;
  elementos: string;
}

interface ApiResponse<T> {
  data: T[];
  success?: boolean;
  message?: string;
}

interface EstadoConservacionResponse {
  data: {
    id: number;
    estado_conservacion: string;
    condiciones_fisicas: string;
    clasificacion: string;
    coef_depreciacion: string;
    createdAt: string;
    updatedAt: string;
  }[];
}

interface FuncionalidadResponse {
  data: {
    id: number;
    Estado: string;
    Puntuacion: string;
    Descripcion: string;
  }[];
}

interface NormativaResponse {
  data: {
    id: number;
    Estado: string;
    Puntuacion: string;
    Descripcion: string;
    createdAt: string;
    updatedAt: string;
  }[];
}

import { LoadingSpinnerSVG } from "~/components/ui/svg";

export default function Page(): JSX.Element {
  const [edificioData, setEdificioData] = useState<{
    codigoEdificio?: string;
    nombre?: string;
    usoActualDescripcion?: string;
    m2Construccion?: number;
    sedeNombre?: string;
  } | null>(null);

  // Estados y efectos existentes
  const [componentes, setComponentes] = useState<Componente[]>([]);
  const [totalPeso, setTotalPeso] = useState<number>(0);
  const [estadosConservacion, setEstadoConservacion] = useState<EstadoConservacion[]>([]);
  const [funcionalidades, setFuncionalidades] = useState<Funcionalidad[]>([]);
  const [normativas, setNormativas] = useState<Normativa[]>([]);

  // Edificación Principal
  const [edadEdificio, setEdadEdificio] = useState<string>("");
  const [vidaUtil, setVidaUtil] = useState<string>("");
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<number>(0);
  const [escalaDepreciacion, setEscalaDepreciacion] = useState<number>(0);

  // Edificación Remodelación
  const [edadEdificioRemodelacion, setEdadEdificioRemodelacion] = useState<string>("");
  const [vidaUtilRemodelacion, setVidaUtilRemodelacion] = useState<string>("");
  const [estadoSeleccionadoRemodelacion, setEstadoSeleccionadoRemodelacion] = useState<number>(0);
  const [porcentajeRemodelacion, setPorcentajeRemodelacion] = useState<number>(0);
  const [escalaDepreciacionRemodelacion, setEscalaDepreciacionRemodelacion] = useState<number>(0);

  // Puntajes
  const [puntajeDepreciacionTotal, setPuntajeDepreciacionTotal] = useState<number>(0);
  const [puntajeComponentes, setPuntajeComponentes] = useState<number>(0);
  const [funcionalidadSeleccionada, setFuncionalidadSeleccionada] = useState<string>("");
  const [normativaSeleccionada, setNormativaSeleccionada] = useState<string>("");
  const [puntajeSeviciabilidad, setPuntajeSeviciabilidad] = useState<number>(0);
  const [puntajeTotalEdificio, setPuntajeTotalEdificios] = useState<number>(0);

  //Imagenes 
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Comentarios
  const [comentarios, setComentarios] = useState<Comentarios>({
    funcionalidad: '',
    normativa: '',
    componentesCriticos: '',
    mejorasRequeridas: ''
  });

  const { userId } = useAuth();

  const router = useRouter();

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onUploadBegin() {
      toast(
        <div className="flex items-center gap-2">
          <LoadingSpinnerSVG /> <span className="text-lg">Subiendo imagenes...</span>
        </div>,
        {
          duration: 5000,
          id: "uploading-toast",
        },
      );
    },
    onUploadError(err) {
      toast.dismiss("uploading-toast");
      toast.error("Upload failed. Please try again.");
      setIsSaving(false);
    },
    onClientUploadComplete: (res) => {
      if (res && res.length > 0) {
        setStagedFiles([]); // Clear staged files after successful upload
      }
      setIsSaving(false);
      toast.success("Imagenes guardadas correctamente!");
    },
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': []
    },
    onDrop: (acceptedFiles) => {
      const newStagedFiles = acceptedFiles.map(file => ({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file)
      }));
      setStagedFiles(prev => [...prev, ...newStagedFiles]);
    }
  });

  const handleRemoveStaged = (id: string) => {
    setStagedFiles(files => {
      const fileToRemove = files.find(f => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return files.filter(f => f.id !== id);
    });
  };

  useEffect(() => {
    const fetchEdificioData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const codigo = urlParams.get('codigo');
      
      if (codigo) {
        try {
          const response = await fetch(`/api/datosEdificio/${codigo}`);
          if (response.ok) {
            const data = await response.json() as EdificioResponse;
            setEdificioData(data);
            setEdadEdificio(data.edad?.toString() ?? "");
            setVidaUtil(data.vidaUtilExperto?.toString() ?? "");
          }
        } catch (error) {
          console.error('Error fetching building data:', error);
        }
      }
    };

    void fetchEdificioData();
  }, []);

  useEffect(() => {
    const fetchComponentes = async (): Promise<void> => {
      try {
        const response = await getComponentes();
        const componentesResponse = response as ApiResponse<ComponenteResponse>;
        const componentesActualizados = (componentesResponse.data ?? []).map((item: ComponenteResponse) => ({
          id: item.id,
          componente: item.componente,
          peso: parseFloat(item.peso),
          elementos: item.elementos,
          necesidadIntervencion: 0,
          existencia: "si" as const,
          pesoEvaluado: 0,
          puntaje: 0
        }));
        setComponentes(componentesActualizados);
        calcularPesoTotal(componentesActualizados);
      } catch (error) {
        console.error('Error fetching componentes:', error);
      }
    };

    void fetchComponentes();
  }, []);

  useEffect(() => {
    const fetchEstadoConservacion = async (): Promise<void> => {
      try {
        const response = await getEstadoConservacion();
        const apiResponse = (response as unknown) as EstadoConservacionResponse;
        const estadoConservacionActualizado = (apiResponse.data ?? []).map((item) => ({
          ...item,
          coef_depreciacion: parseFloat(item.coef_depreciacion),
        }));
        setEstadoConservacion(estadoConservacionActualizado);
      } catch (error) {
        console.error('Error fetching estado conservacion:', error);
      }
    };

    void fetchEstadoConservacion();
  }, []);

  useEffect(() => {
    const fetchFuncionalidades = async (): Promise<void> => {
      try {
        const response = await getFuncionalidades();
        const apiResponse = (response as unknown) as FuncionalidadResponse;
        const funcionalidadesActualizadas = (apiResponse.data ?? []).map((item) => ({
          ...item,
          Puntuacion: parseFloat(item.Puntuacion),
        }));
        setFuncionalidades(funcionalidadesActualizadas);
      } catch (error) {
        console.error('Error fetching funcionalidades:', error);
      }
    };

    void fetchFuncionalidades();
  }, []);

  useEffect(() => {
    const fetchNormativas = async (): Promise<void> => {
      try {
        const response = await getNormativas();
        const apiResponse = (response as unknown) as NormativaResponse;
        const normativasActualizadas = (apiResponse.data ?? []).map((item) => ({
          ...item,
          Puntuacion: parseFloat(item.Puntuacion),
        }));
        setNormativas(normativasActualizadas);
      } catch (error) {
        console.error('Error fetching normativas:', error);
      }
    };

    void fetchNormativas();
  }, []);

  useEffect(() => {
    if (edadEdificio && vidaUtil) {
      const escalaDepreciacion = (1 - (((100 - estadoSeleccionado) / 100) * (1 - (0.5 * ((parseInt(edadEdificio) / parseInt(vidaUtil)) + ((parseInt(edadEdificio) ** 2) / (parseInt(vidaUtil) ** 2))))))).toFixed(2);
      setEscalaDepreciacion(parseFloat(escalaDepreciacion));
    }
  }, [edadEdificio, vidaUtil, estadoSeleccionado]);

  useEffect(() => {
    if (edadEdificioRemodelacion && vidaUtilRemodelacion) {
      const escalaDepreciacionRemodelacion = (1 - (((100 - estadoSeleccionadoRemodelacion) / 100) * (1 - (0.5 * ((parseInt(edadEdificioRemodelacion) / parseInt(vidaUtilRemodelacion)) + ((parseInt(edadEdificioRemodelacion) ** 2) / (parseInt(vidaUtilRemodelacion) ** 2))))))).toFixed(4);
      setEscalaDepreciacionRemodelacion(parseFloat(escalaDepreciacionRemodelacion));
    }
  }, [edadEdificioRemodelacion, vidaUtilRemodelacion, estadoSeleccionadoRemodelacion]);

  useEffect(() => {
    if (escalaDepreciacion && escalaDepreciacionRemodelacion && porcentajeRemodelacion) {
      const puntajeTotal = ((escalaDepreciacion * (1 - porcentajeRemodelacion / 100)) + (escalaDepreciacionRemodelacion * escalaDepreciacion)).toFixed(2);
      setPuntajeDepreciacionTotal(parseFloat(puntajeTotal));
    }
  }, [escalaDepreciacion, escalaDepreciacionRemodelacion, porcentajeRemodelacion]);

  useEffect(() => {
    const totalPuntajeComponentes = componentes.reduce((total, componente) => total + (componente.puntaje ??0), 0);
    setPuntajeComponentes(parseFloat(totalPuntajeComponentes.toFixed(3)));
  }, [componentes]);

  useEffect(() => {
    const funcionalidad = funcionalidades.find(f => f.id === parseFloat(funcionalidadSeleccionada));
    const normativa = normativas.find(n => n.id === parseFloat(normativaSeleccionada));
  
    if (funcionalidad && normativa) {
      const puntajeTotal = parseFloat(funcionalidad.Puntuacion.toString()) + parseFloat(normativa.Puntuacion.toString());
      setPuntajeSeviciabilidad(parseFloat(puntajeTotal.toFixed(2)));
    } else {
      setPuntajeSeviciabilidad(0);
    }
  }, [funcionalidadSeleccionada, normativaSeleccionada, funcionalidades, normativas]);

  useEffect(() => {
    const puntajeTotal = puntajeDepreciacionTotal + puntajeComponentes + puntajeSeviciabilidad;
    setPuntajeTotalEdificios(puntajeTotal);
  }, [puntajeDepreciacionTotal, puntajeComponentes, puntajeSeviciabilidad]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number): void => {
    const value = parseFloat(e.target.value);
    const newComponentes = [...componentes];
    if (newComponentes[index]) {
      newComponentes[index].necesidadIntervencion = value;
    }
    setComponentes(newComponentes);
  };

  const handleExistenciaChange = (index: number, value: string): void => {
    const newComponentes = [...componentes];
    if (newComponentes[index]) {
      newComponentes[index].existencia = value;
      calcularPesoTotal(newComponentes);
    }
    setComponentes(newComponentes);
  };

  const getInputColor = (value: number, existencia: string): string => {
    if (existencia === "no") return '';
    if (value >= 66) return 'bg-red-200';
    if (value >= 33) return 'bg-yellow-200';
    return 'bg-green-200';
  };

  const calcularPesoTotal = (componentes: Componente[]): void => {
    const pesoTotal = componentes
      .filter((componente: Componente) => componente.existencia === "si")
      .reduce((total: number, componente: Componente) => total + componente.peso, 0);
    setTotalPeso(pesoTotal);
  };

  const calcularPesoEvaluacion = (componente: Componente): string => {
    let pesoEvaluado = "0";
    if (componente.existencia === "si") {
      pesoEvaluado = ((componente.peso * (1 + ((1 - totalPeso) / totalPeso))) * 100).toFixed(2);
      componente.pesoEvaluado = parseFloat(pesoEvaluado);
    }
    else{
      componente.pesoEvaluado = 0;
    }
    return pesoEvaluado;
  };

  const calcularPuntajeComponentes = (componente: Componente): string => {
    const puntaje = ((componente.pesoEvaluado ?? 0) / 100 * (componente.necesidadIntervencion) / 100).toFixed(3);
    componente.puntaje = parseFloat(puntaje);
    return puntaje;
  };

  const handleComentarioChange = (field: keyof Comentarios, value: string) => {
    setComentarios(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const evaluacion = {
      edificio: {
        codigo: edificioData?.codigoEdificio ?? '',
        nombre: edificioData?.nombre ?? '',
        campus: edificioData?.sedeNombre ?? '',
        usoActual: edificioData?.usoActualDescripcion ?? '',
        area: edificioData?.m2Construccion ?? 0,
        descripcion: (document.querySelector('#descripcion') as HTMLTextAreaElement)?.value ?? ''
      },
      depreciacion: {
        principal: {
          edad: parseInt(edadEdificio) ??0,
          vidaUtil: parseInt(vidaUtil) ??0,
          estadoConservacionCoef: estadoSeleccionado,
          escalaDepreciacion: escalaDepreciacion
        },
        remodelacion: {
          edad: parseInt(edadEdificioRemodelacion) ??0,
          vidaUtil: parseInt(vidaUtilRemodelacion) ??0,
          estadoConservacionCoef: estadoSeleccionadoRemodelacion,
          porcentaje: porcentajeRemodelacion,
          escalaDepreciacion: escalaDepreciacionRemodelacion
        },
        puntajeDepreciacionTotal: puntajeDepreciacionTotal
      },
      componentes: componentes.map(comp => ({
        id: comp.id,
        componente: comp.componente,
        peso: comp.peso,
        existencia: comp.existencia,
        necesidadIntervencion: comp.necesidadIntervencion,
        pesoEvaluado: comp.pesoEvaluado,
        puntaje: comp.puntaje
      })),
      puntajeComponentes: puntajeComponentes,
      serviciabilidad: {
        funcionalidadId: parseInt(funcionalidadSeleccionada),
        normativaId: parseInt(normativaSeleccionada),
        puntajeServiciabilidad: puntajeSeviciabilidad
      },
      puntajeTotalEdificio: puntajeTotalEdificio,
      comentarios,
      idEvaluador: userId
    };

    try {
      const result = await guardarEvaluacion(evaluacion);

      if (result.success && result.insertedId) {
        toast.success(result.message);

        if (stagedFiles.length > 0) {
          setIsSaving(true);
          await startUpload(stagedFiles.map(f => f.file), {
            evaluationId: result.insertedId.toString(),
            description: "Imágenes de evaluación",
          });
        }
        
        router.push('/edificios');
      } else {
        toast.error(result.message ??"Error al guardar la evaluación");
      }
    } catch (error) {
      console.error("Error al guardar la evaluación:", error);
      toast.error("Error al guardar la evaluación");
    }
  };

  useEffect(() => {
    return () => {
      stagedFiles.forEach(file => {
        URL.revokeObjectURL(file.preview);
      });
    };
  }, []);

  return (
    <div className="container mx-auto py-6 border border-gray-300 rounded-xl">
      <h1 className="text-2xl font-bold text-center mb-8">Evaluación de Edificaciones</h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <BuildingInfoSection edificioData={edificioData} />
        
        <DepreciationSection
          edadEdificio={edadEdificio}
          setEdadEdificio={setEdadEdificio}
          vidaUtil={vidaUtil}
          setVidaUtil={setVidaUtil}
          estadoSeleccionado={estadoSeleccionado}
          setEstadoSeleccionado={setEstadoSeleccionado}
          escalaDepreciacion={escalaDepreciacion}
          edadEdificioRemodelacion={edadEdificioRemodelacion}
          setEdadEdificioRemodelacion={setEdadEdificioRemodelacion}
          vidaUtilRemodelacion={vidaUtilRemodelacion}
          setVidaUtilRemodelacion={setVidaUtilRemodelacion}
          estadoSeleccionadoRemodelacion={estadoSeleccionadoRemodelacion}
          setEstadoSeleccionadoRemodelacion={setEstadoSeleccionadoRemodelacion}
          porcentajeRemodelacion={porcentajeRemodelacion}
          setPorcentajeRemodelacion={setPorcentajeRemodelacion}
          escalaDepreciacionRemodelacion={escalaDepreciacionRemodelacion}
          puntajeDepreciacionTotal={puntajeDepreciacionTotal}
          estadosConservacion={estadosConservacion}
        />

        <ComponentsTable
          componentes={componentes}
          totalPeso={totalPeso}
          puntajeComponentes={puntajeComponentes}
          handleChange={handleChange}
          handleExistenciaChange={handleExistenciaChange}
          calcularPesoEvaluacion={calcularPesoEvaluacion}
          calcularPuntajeComponentes={calcularPuntajeComponentes}
          getInputColor={getInputColor}
        />

        <ServiceabilitySection
          funcionalidades={funcionalidades}
          normativas={normativas}
          funcionalidadSeleccionada={funcionalidadSeleccionada}
          setFuncionalidadSeleccionada={setFuncionalidadSeleccionada}
          normativaSeleccionada={normativaSeleccionada}
          setNormativaSeleccionada={setNormativaSeleccionada}
          puntajeSeviciabilidad={puntajeSeviciabilidad}
        />

        <TotalScoreTable
          puntajeDepreciacionTotal={puntajeDepreciacionTotal}
          puntajeComponentes={puntajeComponentes}
          puntajeSeviciabilidad={puntajeSeviciabilidad}
          puntajeTotalEdificio={puntajeTotalEdificio}
        />

        <CommentsSection
          comentarios={comentarios}
          handleComentarioChange={handleComentarioChange}
        />

        <div className="mt-6 border-t pt-6">
          <h2 className="mb-4 text-xl font-semibold">
            Imágenes de la evaluación
          </h2>

          <div {...getRootProps()} className={`mb-4 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}>
            <input {...getInputProps()} />
            <div className="flex flex-col items-center">
              <Upload className="h-12 w-12 text-gray-400 mb-2" />
              {isDragActive ? (
                <p>Suelta las imágenes aquí ...</p>
              ) : (
                <p>Arrastra y suelta imágenes aquí, o haz clic para seleccionar</p>
              )}
            </div>
          </div>

          {/* Staged Images */}
          {stagedFiles.length > 0 && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">
                  Imágenes pendientes ({stagedFiles.length})
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {stagedFiles.map((file) => (
                  <div key={file.id} className="group relative overflow-hidden rounded-md border">
                    <div className="relative aspect-square">
                      <img
                        src={file.preview}
                        alt={file.file.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveStaged(file.id)}
                      className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="truncate p-2 text-xs">{file.file.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" type="reset" className="px-6 text-gray-700 border-gray-300 hover:bg-gray-100" >
            Limpiar
          </Button>

          <Button type="submit" className="px-6 bg-[#00205B] hover:bg-[#003080] text-white" disabled={isSaving ??isUploading}>
            {isSaving ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </form>
    </div>
  );
}
