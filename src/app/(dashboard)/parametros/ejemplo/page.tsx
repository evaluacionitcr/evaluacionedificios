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
  registroFotografico: string;
}

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

  // Comentarios
  const [comentarios, setComentarios] = useState<Comentarios>({
    funcionalidad: '',
    normativa: '',
    componentesCriticos: '',
    mejorasRequeridas: '',
    registroFotografico: ''
  });

  useEffect(() => {
    const fetchEdificioData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const codigo = urlParams.get('codigo');
      
      if (codigo) {
        try {
          const response = await fetch(`/api/datosEdificio/${codigo}`);
          if (response.ok) {
            const data = await response.json();
            setEdificioData(data);
            setEdadEdificio(data.edad?.toString() || "");
            setVidaUtil(data.vidaUtilExperto?.toString() || "");
          }
        } catch (error) {
          console.error('Error fetching building data:', error);
        }
      }
    };

    fetchEdificioData();
  }, []);

  useEffect(() => {
    const fetchComponentes = async (): Promise<void> => {
      const response = await getComponentes();
      const componentesActualizados = (response.data ?? []).map((item: any) => ({
        ...item,
        peso: parseFloat(item.peso),
        necesidadIntervencion: 0,
        existencia: "si",
      }));
      setComponentes(componentesActualizados);
      calcularPesoTotal(componentesActualizados);
    };

    fetchComponentes();
  }, []);

  useEffect(() => {
    const fetchEstadoConservacion = async (): Promise<void> => {
      const response = await getEstadoConservacion();
      const estadoConservacionActualizado = (response.data ?? []).map((item: any) => ({
        ...item,
        coef_depreciacion: parseFloat(item.coef_depreciacion),
      }));
      setEstadoConservacion(estadoConservacionActualizado);
    };

    fetchEstadoConservacion();
  }, []);

  useEffect(() => {
    const fetchFuncionalidades = async (): Promise<void> => {
      const response = await getFuncionalidades();
      const funcionalidadesActualizadas = (response.data ?? []).map((item: any) => ({
        ...item,
        puntuacion: parseFloat(item.Puntuacion),
      }));
      setFuncionalidades(funcionalidadesActualizadas);
    };

    fetchFuncionalidades();
  }, []);

  useEffect(() => {
    const fetchNormativas = async (): Promise<void> => {
      const response = await getNormativas();
      const normativasActualizadas = (response.data ?? []).map((item: any) => ({
        ...item,
        puntuacion: parseFloat(item.Puntuacion),
      }));
      setNormativas(normativasActualizadas);
    };

    fetchNormativas();
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
    const totalPuntajeComponentes = componentes.reduce((total, componente) => total + (componente.puntaje || 0), 0);
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

  const getInputColor = (value: number): string => {
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const evaluacion = {
      edificio: {
        codigo: edificioData?.codigoEdificio || '',
        nombre: edificioData?.nombre || '',
        campus: edificioData?.sedeNombre || '',
        usoActual: edificioData?.usoActualDescripcion || '',
        area: edificioData?.m2Construccion || 0,
        descripcion: (e.currentTarget.querySelector('#descripcion') as HTMLTextAreaElement).value
      },
      depreciacion: {
        principal: {
          edad: parseInt(edadEdificio) || 0,
          vidaUtil: parseInt(vidaUtil) || 0,
          estadoConservacionCoef: estadoSeleccionado,
          escalaDepreciacion: escalaDepreciacion
        },
        remodelacion: {
          edad: parseInt(edadEdificioRemodelacion) || 0,
          vidaUtil: parseInt(vidaUtilRemodelacion) || 0,
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
        funcionalidadId: funcionalidadSeleccionada,
        normativaId: normativaSeleccionada,
        puntajeServiciabilidad: puntajeSeviciabilidad
      },
      puntajeTotalEdificio: puntajeTotalEdificio,
      comentarios
    };

     

    console.log(JSON.stringify(evaluacion, null, 2));
  };

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

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" type="reset" className="px-6 text-gray-700 border-gray-300 hover:bg-gray-100">
            Limpiar
          </Button>
          <Button type="submit" className="px-6 bg-[#00205B] hover:bg-[#003080] text-white">
            Guardar
          </Button>
        </div>
      </form>
    </div>
  );
}
