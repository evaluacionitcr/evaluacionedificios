"use client";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { getComponentes, getEstadoConservacion, getFuncionalidades, getNormativas } from "./actions";
import BuildingInfoSection from "./components/BuildingInfoSection";
import DepreciationSection from "./components/DepreciationSection";
import ComponentsTable from "./components/ComponentsTable";
import ServiceabilitySection from "./components/ServiceabilitySection";
import TotalScoreTable from "./components/TotalScoreTable";
import CommentsSection from "./components/CommentsSection";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, X, Upload } from "lucide-react";
import { useDropzone } from 'react-dropzone';
import { useUploadThing } from "~/utils/uploadthing";
import Image from "next/image";
import { toast } from "sonner";

interface Componente {
  id: number;
  componente: string;
  peso: number;
  necesidadIntervencion: number;
  existencia: string;
  pesoEvaluado?: number;
  puntaje?: number;
  elementos: string;
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

import { LoadingSpinnerSVG } from "~/components/ui/svg";

export default function Page(): JSX.Element {
  const searchParams = useSearchParams();
  const codigo = searchParams?.get("codigo"); // Add optional chaining
  const [edificioData, setEdificioData] = useState<{
    codigoEdificio?: string;
    nombre?: string;
    usoActualDescripcion?: string;
    m2Construccion?: number;
    sedeNombre?: string;
  } | null>(null);

  const [depreciacionData, setDepreciacionData] = useState<{
    puntajeDepreciacionTotal: number;
    principal: {
      edad: string;
      vidaUtil: string;
      estadoConservacionCoef: number;
      escalaDepreciacion: number;
    };
    remodelacion: {
      edad: string;
      vidaUtil: string;
      estadoConservacionCoef: number;
      porcentajeRemodelacion: number;
      escalaDepreciacion: number;
      porcentaje: number;
    };
    estadosConservacion: EstadoConservacion[];
  } | null>(null);

  const [serviceabilityData, setServiceabilityData] = useState<{
    funcionalidadId: number;
    normativaId: number;
    puntajeServiciabilidad: number;
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
  const [arrayImagenes, setArrayImagenes] = useState<string[]>([]);


  // Comentarios
  const [comentarios, setComentarios] = useState<Comentarios>({
    funcionalidad: '',
    normativa: '',
    componentesCriticos: '',
    mejorasRequeridas: ''
  });

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
    const fetchEvaluacionData = async () => {
      if (codigo) {
        try {
          const response = await fetch(`/api/datosEvaluacion/${codigo}`);
          if (response.ok) {
            const data = await response.json() as {
              data: {
                edificio: typeof edificioData;
                componentes: Componente[];
                depreciacion: typeof depreciacionData;
                serviciabilidad: typeof serviceabilityData & { puntajeServiciabilidad: number };
                comentarios: Comentarios;
                puntajeComponentes: number;
                puntajeTotalEdificio: number;
              };
            };
            
            setEdificioData(data.data.edificio ?? null);
            setComponentes(data.data.componentes ?? []);
            setDepreciacionData(data.data.depreciacion ?? null);
            setServiceabilityData(data.data.serviciabilidad ?? null);
            setComentarios(data.data.comentarios ?? {
              funcionalidad: '',
              normativa: '',
              componentesCriticos: '',
              mejorasRequeridas: ''
            });
            setPuntajeDepreciacionTotal(data.data.depreciacion?.puntajeDepreciacionTotal ?? 0);
            setPuntajeComponentes(data.data.puntajeComponentes ?? 0);
            setPuntajeTotalEdificios(data.data.puntajeTotalEdificio ?? 0);
            setPuntajeSeviciabilidad(data.data.serviciabilidad?.puntajeServiciabilidad ?? 0);
          }
        } catch (error) {
          console.error('Error fetching evaluation data:', error);
        }
      }
    };

    void fetchEvaluacionData();
  }, [codigo]);

  useEffect(() => {
    const fetchImagenes = async () => {
      if (codigo) {
        try {
          const response = await fetch(`/api/imagenes/${codigo}`);
          if (response.ok) {
            const data = await response.json() as string[];
            setArrayImagenes(data);
          }
        } catch (error) {
          console.error('Error fetching images:', error);
          toast.error('Error al cargar las imágenes');
        }
      }
    };

    void fetchImagenes();
  }, [codigo]);

  useEffect(() => {
    const fetchComponentes = async (): Promise<void> => {
      try {
        const response = await getComponentes();
        const componentesActualizados = (response.data ?? []).map((item: { id: number; componente: string; peso: string; elementos: string }) => ({
          id: item.id,
          componente: item.componente,
          peso: parseFloat(item.peso),
          elementos: item.elementos,
          necesidadIntervencion: 0,
          existencia: "si",
          pesoEvaluado: 0,
          puntaje: 0,
        } as Componente));
        setComponentes(componentesActualizados);
        calcularPesoTotal(componentesActualizados);
      } catch (error) {
        console.error('Error fetching componentes:', error);
        toast.error('Error al cargar los componentes');
      }
    };

    void fetchComponentes();
  }, []);

  useEffect(() => {
    const fetchEstadoConservacion = async (): Promise<void> => {
      try {
        const response = await getEstadoConservacion();
        const estadoConservacionActualizado = (response.data ?? []).map((item) => ({
          id: item.id,
          estado_conservacion: item.estado_conservacion,
          condiciones_fisicas: item.condiciones_fisicas,
          clasificacion: item.clasificacion,
          coef_depreciacion: parseFloat(item.coef_depreciacion),
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        } as EstadoConservacion));
        setEstadoConservacion(estadoConservacionActualizado);
      } catch (error) {
        console.error('Error fetching estado conservacion:', error);
        toast.error('Error al cargar los estados de conservación');
      }
    };

    void fetchEstadoConservacion();
  }, []);

  useEffect(() => {
    const fetchFuncionalidades = async (): Promise<void> => {
      try {
        const response = await getFuncionalidades();
        const funcionalidadesActualizadas = (response.data ?? []).map((item) => ({
          id: item.id,
          Estado: item.Estado,
          Puntuacion: parseFloat(item.Puntuacion),
          Descripcion: item.Descripcion
        } as Funcionalidad));
        setFuncionalidades(funcionalidadesActualizadas);
      } catch (error) {
        console.error('Error fetching funcionalidades:', error);
        toast.error('Error al cargar las funcionalidades');
      }
    };

    void fetchFuncionalidades();
  }, []);

  useEffect(() => {
    const fetchNormativas = async (): Promise<void> => {
      try {
        const response = await getNormativas();
        const normativasActualizadas = (response.data ?? []).map((item) => ({
          id: item.id,
          Estado: item.Estado,
          Puntuacion: parseFloat(item.Puntuacion),
          Descripcion: item.Descripcion,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        } as Normativa));
        setNormativas(normativasActualizadas);
      } catch (error) {
        console.error('Error fetching normativas:', error);
        toast.error('Error al cargar las normativas');
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
    const funcionalidad = funcionalidades.find(f => f.id === parseFloat(funcionalidadSeleccionada));
    const normativa = normativas.find(n => n.id === parseFloat(normativaSeleccionada));
    
    if (funcionalidad && normativa) {
      const nuevoPuntaje = (funcionalidad.Puntuacion + normativa.Puntuacion) / 2;
      setPuntajeSeviciabilidad(nuevoPuntaje);
    }
  }, [funcionalidadSeleccionada, normativaSeleccionada, funcionalidades, normativas]);

  const handleChange = (_e: React.ChangeEvent<HTMLInputElement>, index: number): void => {
    const updatedComponentes = [...componentes];
    const componente = updatedComponentes[index];
    if (componente) {
      const value = parseFloat(_e.target.value);
      if (!isNaN(value) && value >= 0 && value <= 100) {
        componente.necesidadIntervencion = value;
        setComponentes(updatedComponentes);
      }
    }
  };

  const handleExistenciaChange = (index: number, value: string): void => {
    const updatedComponentes = [...componentes];
    const componente = updatedComponentes[index];
    if (componente) {
      componente.existencia = value;
      setComponentes(updatedComponentes);
      calcularPesoTotal(updatedComponentes);
    }
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

  const handleComentarioChange = (field: keyof Comentarios, value: string): void => {
    setComentarios(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add your submit logic here
  };

  useEffect(() => {
    return () => {
      stagedFiles.forEach(file => {
        URL.revokeObjectURL(file.preview);
      });
    };
  }, [stagedFiles]);

  return (
    <div className="container mx-auto py-6 border border-gray-300 rounded-xl">
      <h1 className="text-2xl font-bold text-center mb-8">Evaluación de Edificaciones</h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <BuildingInfoSection edificioData={edificioData} />
        
        <DepreciationSection depreciacionData={depreciacionData}/>

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
          serviceabilityData={serviceabilityData}
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
        <div> 
          {/* Imágenes existentes desde arrayImagenes */}
        {arrayImagenes.length > 0 && (
          <div className="mt-8">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {arrayImagenes.length > 0 ? (
          arrayImagenes.map((url, index) => (
            <div key={index} className="group relative overflow-hidden rounded-md border">
            <div className="relative aspect-square">
              <img
              src={url}
              alt={`Imagen ${index + 1}`}
              className="h-full w-full object-cover"
              />
            </div>
            </div>
          ))
          ) : (
          <p className="text-center text-gray-500">No hay imágenes disponibles para esta evaluación.</p>
          )}
            </div>
          </div>
        )}
          </div>
        </div>
      </form>
    </div>
  );
}
