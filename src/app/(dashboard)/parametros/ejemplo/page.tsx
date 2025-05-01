"use client";
import { use, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { getComponentes, getEstadoConservacion, getFuncionalidades, getNormativas } from "./actions";
import { set } from "zod";

interface Componente {
  id: number;
  componente: string;
  peso: number;
  necesidadIntervencion: number;
  existencia: string;
  pesoEvaluado?: number;
  puntaje?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface EstadoConservacion {
  id: number;
  estado_conservacion: string;
  condiciones_fisicas: string;
  clasificacion: string;
  coef_depreciacion: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface Funcionalidad {
  id: number;
  Estado: string;
  Puntuacion: number;
  Descripcion: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface Normativa {
  id: number;
  Estado: string;
  Puntuacion: number;
  Descripcion: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default function Page(): JSX.Element {
  const [edificioData, setEdificioData] = useState<{
    codigoEdificio?: string;
    nombre?: string;
    usoActualDescripcion?: string;
    m2Construccion?: number;
    sedeNombre?: string;
    edad?: number;
    vidaUtilExperto?: number;
  } | null>(null);

  useEffect(() => {
    const fetchEdificioData = async () => {
      // Get the URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const codigo = urlParams.get('codigo');
      
      if (codigo) {
        try {
          const response = await fetch(`/api/datosEdificio/${codigo}`);
          if (response.ok) {
            const data = await response.json();
            setEdificioData(data);
            // Asegurar que los valores sean strings válidos
            if (data.edad !== undefined && data.edad !== null) {
              setEdadEdificio(data.edad.toString());
            }
            if (data.vidaUtilExperto !== undefined && data.vidaUtilExperto !== null) {
              setVidaUtil(data.vidaUtilExperto.toString());
            }
          }
        } catch (error) {
          console.error('Error fetching building data:', error);
        }
      }
    };

    fetchEdificioData();
  }, []);

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

  // Puntaje Serviciabilidad
  const [funcionalidadSeleccionada, setFuncionalidadSeleccionada] = useState<string>("");
  const [normativaSeleccionada, setNormativaSeleccionada] = useState<string>("");

  const [puntajeDepreciacionTotal, setPuntajeDepreciacionTotal] = useState<number>(0);
  const [puntajeComponentes, setPuntajeComponentes] = useState<number>(0);
  const [puntajeSeviciabilidad, setPuntajeSeviciabilidad] = useState<number>(0);
  const [puntajeTotalEdificio, setPuntajeTotalEdificios] = useState<number>(0);

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
      console.log(funcionalidadesActualizadas);
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
      console.log(normativasActualizadas);
    };

    fetchNormativas();
  }, []);

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

    if (pesoTotal !== totalPeso) {
      setTotalPeso(pesoTotal);
    }
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
    console.log("Total Puntaje Componentes:", totalPuntajeComponentes);
    setPuntajeComponentes(parseFloat(totalPuntajeComponentes.toFixed(3)));
  }, [componentes]);

  useEffect(() => {
    const funcionalidad = funcionalidades.find(f => f.id === parseInt(funcionalidadSeleccionada));
    const normativa = normativas.find(n => n.id === parseInt(normativaSeleccionada));
  
    if (funcionalidad && normativa) {
      console.log(funcionalidad, normativa);
      const puntajeTotal = funcionalidad.Puntuacion + normativa.Puntuacion;
      setPuntajeSeviciabilidad(puntajeTotal);
    } else {
      setPuntajeSeviciabilidad(0);
    }
  }, [funcionalidadSeleccionada, normativaSeleccionada, funcionalidades, normativas]);

  useEffect(() => {
    const puntajeTotal = puntajeDepreciacionTotal + puntajeComponentes + puntajeSeviciabilidad;
    setPuntajeTotalEdificios(puntajeTotal);
  }, [puntajeDepreciacionTotal, puntajeComponentes, puntajeSeviciabilidad]);

  return (
    <div className="container mx-auto py-6 border border-gray-300 rounded-xl">
      <h1 className="text-2xl font-bold text-center mb-8">Evaluación de Edificaciones</h1>
      <form className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="edificio" className="text-base font-medium text-gray-700">Edificio</label>
            <input
              id="edificio"
              placeholder="Ej: Edificio U-11"
              value={edificioData?.nombre || ""}
              readOnly
              className="w-full h-11 px-4 border border-gray-300 rounded-md bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="codigo" className="text-base font-medium text-gray-700">Código</label>
            <input
              id="codigo"
              value={edificioData?.codigoEdificio || ""}
              readOnly
              className="w-full h-11 px-4 border border-gray-300 rounded-md bg-gray-50"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="campus" className="text-base font-medium text-gray-700">Campus Tecnológico / Centro Académico</label>
          <input
            id="campus"
            value={edificioData?.sedeNombre || ""}
            readOnly
            className="w-full h-11 px-4 border border-gray-300 rounded-md bg-gray-50"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="area" className="text-base font-medium text-gray-700">Área (m²)</label>
            <input
              id="area"
              value={edificioData?.m2Construccion || ""}
              readOnly
              className="w-full h-11 px-4 border border-gray-300 rounded-md bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="uso" className="text-base font-medium text-gray-700">Uso</label>
            <input
              id="uso"
              value={edificioData?.usoActualDescripcion || ""}
              readOnly
              className="w-full h-11 px-4 border border-gray-300 rounded-md bg-gray-50"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="descripcion" className="text-base font-medium text-gray-700">Descripción</label>
          <textarea
            id="descripcion"
            placeholder="Ingrese la descripción detallada del edificio"
            className="w-full min-h-[200px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <h1 className="text-2xl font-bold text-center mb-8">Puntaje por depreciación del edificio</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="bg-[#00205B] text-white text-center py-3 font-semibold">Edificación Principal</div>
          <div className="bg-[#00205B] text-white text-center py-3 font-semibold">Remodelación</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="border-r border-gray-200 p-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="edad-edificio" className="text-base font-medium">Edad de Edificio</label>
              <input
                id="edad-edificio"
                type="number"
                value={edadEdificio}
                onChange={(e) => setEdadEdificio(e.target.value)}
                placeholder="Cargar la edad del edificio"
                className="w-full h-11 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="vida-util-principal" className="text-base font-medium">Vida Útil Esperada</label>
              <input
                id="vida-util-principal"
                value={vidaUtil}
                onChange={(e) => setVidaUtil(e.target.value)}
                placeholder="Cargar la vida útil esperada"
                className="w-full h-11 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="estado-conservacion-principal" className="text-base font-medium">Estado de Conservación</label>
              <select
                value={estadoSeleccionado}
                onChange={(e) => setEstadoSeleccionado(parseFloat(e.target.value))}
                className="w-full h-11 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {estadosConservacion.map((estado, index) => (
                  <option key={index} value={estado.coef_depreciacion}>
                    {estado.clasificacion}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="escala-depreciacion-principal" className="text-base font-medium">Escala de depreciación</label>
              <input
                id="escala-depreciacion-principal"
                value={escalaDepreciacion}
                readOnly
                placeholder="Cargar la escala de depreciación"
                className="w-full h-11 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="edad-remodela" className="text-base font-medium">Edad de Remodelación</label>
              <input
                id="edad-remodela"
                type="number"
                value={edadEdificioRemodelacion}
                onChange={(e) => setEdadEdificioRemodelacion(e.target.value)}
                placeholder="Cargar la edad de la remodelación"
                className="w-full h-11 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="vida-util-remodela" className="text-base font-medium">Vida Útil Esperada</label>
              <input
                id="vida-util-remodela"
                value={vidaUtilRemodelacion}
                onChange={(e) => setVidaUtilRemodelacion(e.target.value)}
                placeholder="Cargar la vida útil esperada"
                className="w-full h-11 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="estado-conservacion-remodela" className="text-base font-medium">Estado de Conservación</label>
              <select
                value={estadoSeleccionadoRemodelacion}
                onChange={(e) => setEstadoSeleccionadoRemodelacion(parseFloat(e.target.value))}
                className="w-full h-11 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {estadosConservacion.map((estado, index) => (
                  <option key={index} value={estado.coef_depreciacion}>
                    {estado.clasificacion}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="porcentaje-remodelacion" className="text-base font-medium">Porcentaje de Remodelación/Ampliación</label>
              <div className="relative">
                <input
                  id="porcentaje-remodelacion"
                  value={porcentajeRemodelacion}
                  onChange={(e) => setPorcentajeRemodelacion(parseFloat(e.target.value))}
                  type="number"
                  className="w-full h-11 px-4 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2">%</span>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="escala-depreciacion-remodela" className="text-base font-medium">Escala de depreciación Remodelación/Ampliación</label>
              <input
                id="escala-depreciacion-principal"
                value={escalaDepreciacionRemodelacion}
                readOnly
                placeholder="Cargar la escala de depreciación"
                className="w-full h-11 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-yellow-100 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <label htmlFor="puntaje-total" className="text-base font-bold">PUNTAJE DE DEPRECIACIÓN TOTAL</label>
            <input
              id="puntaje-total"
              value={puntajeDepreciacionTotal}
              readOnly
              className="w-full md:max-w-[200px] h-11 font-bold text-center"
            />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-8">Puntaje del estado de los componentes y sistemas del edificio</h1>

        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold text-center whitespace-nowrap bg-[#00205B] text-white w-[12%]">
                  Componente o Sistema
                </TableHead>
                <TableHead className="font-semibold text-center whitespace-nowrap bg-[#00205B] text-white w-[8%]">
                  Existencia
                </TableHead>
                <TableHead className="font-semibold text-center whitespace-nowrap bg-[#00205B] text-white">
                  Peso [P]
                </TableHead>
                <TableHead className="font-semibold text-center bg-[#00205B] text-white w-[40%]">
                  Elementos a valorar del componente o sistema
                </TableHead>
                <TableHead
                  className="font-semibold text-center whitespace-nowrap bg-[#00205B] text-white w-[24%]"
                  colSpan={3}
                >
                  Necesidad de intervención (N)
                </TableHead>
                <TableHead className="font-semibold text-center bg-yellow-100 whitespace-nowrap w-[8%]">
                  Puntaje
                </TableHead>
              </TableRow>
              <TableRow>
                <TableHead className="bg-gray-100"></TableHead>
                <TableHead className="bg-gray-100"></TableHead>
                <TableHead className="bg-gray-100"></TableHead>
                <TableHead className="bg-gray-100"></TableHead>
                <TableHead className="font-semibold text-center whitespace-nowrap bg-green-100">
                  Bajo (0-33)%
                </TableHead>
                <TableHead className="font-semibold text-center whitespace-nowrap bg-yellow-100">
                  Medio (33-66)%
                </TableHead>
                <TableHead className="font-semibold text-center whitespace-nowrap bg-red-100">
                  Alto (66-100)%
                </TableHead>
                <TableHead className="bg-yellow-100"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {componentes.map((componente, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{componente.componente}</TableCell>
                  <TableCell className="text-center">
                    <RadioGroup
                      value={componente.existencia}
                      onValueChange={(value) => handleExistenciaChange(index, value)}
                      className="flex justify-center space-x-2"
                    >
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem id={`${componente.componente}-si`} value="si" />
                        <Label htmlFor={`${componente.componente}-si`}>Sí</Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem id={`${componente.componente}-no`} value="no" />
                        <Label htmlFor={`${componente.componente}-no`}>No</Label>
                      </div>
                    </RadioGroup>
                  </TableCell>
                  <TableCell>
                    <div className="relative flex items-center">
                      <Input value={calcularPesoEvaluacion(componente)} readOnly className="text-right w-20 mx-auto pr-8" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    <textarea className="w-full h-20 px-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Ingrese los elementos a valorar"></textarea>
                  </TableCell>
                  <TableCell colSpan={3} className="text-center">
                    <div className="relative flex items-center justify-center">
                      <Input
                        type="number"
                        value={componente.necesidadIntervencion}
                        onChange={(e) => handleChange(e, index)}
                        disabled={componente.existencia === "no"}
                        className={`mx-auto pr-2 ${getInputColor(componente.necesidadIntervencion)}`}
                      />
                      <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-bold bg-yellow-100">
                    {calcularPuntajeComponentes(componente)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <tfoot>
              <TableRow>
                <TableCell className="font-bold text-center" colSpan={2}>Total</TableCell>
                <TableCell className="font-bold text-center">
                  {componentes.reduce((total, componente) => total + componente.peso, 0).toFixed(2)}%
                </TableCell>
                <TableCell colSpan={4}></TableCell>
                <TableCell className="font-bold text-center bg-yellow-100">
                  {puntajeComponentes}
                </TableCell>
              </TableRow>
            </tfoot>
          </Table>
        </div>

        <h1 className="text-2xl font-bold text-center mb-8">Puntaje por serviacibilidad</h1>

        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold text-center whitespace-nowrap bg-[#00205B] text-white w-[12%]">
                  Funcionalidad
                </TableHead>
                <TableHead className="font-semibold text-center whitespace-nowrap bg-[#00205B] text-white w-[12%]">
                  Normativa
                </TableHead>
                <TableHead className="font-semibold text-center whitespace-nowrap bg-[#00205B] text-white w-[12%]">
                  Puntaje Total
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="text-center">
                <select
                  value={funcionalidadSeleccionada}
                  onChange={(e) => setFuncionalidadSeleccionada(e.target.value)}
                  className="w-full h-11 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {funcionalidades.map((funcionalidad, index) => (
                    <option key={funcionalidad.id} value={funcionalidad.id}>
                      {funcionalidad.Estado}
                    </option>
                  ))}
                </select>
                </TableCell>
                <TableCell className="text-center">
                  <select
                    value={normativaSeleccionada}
                    onChange={(e) => {
                      const value = e.target.value;
                      console.log('Normativa seleccionada:', value);
                      setNormativaSeleccionada(value);
                    }}
                    className="w-full h-11 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {normativas.map((normativa, index) => (
                      <option key={normativa.id} value={normativa.id}>
                        {normativa.Estado}
                      </option>
                    ))}
                  </select>
                </TableCell>
                <TableCell className="text-center font-bold bg-yellow-100">
                  {puntajeSeviciabilidad.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <h1 className="text-2xl font-bold text-center mb-8">Total del Edificio</h1>
        <div>
          <Table>
          <TableHeader>
              <TableRow>
                <TableHead className="font-semibold text-center whitespace-nowrap bg-[#00205B] text-white w-[12%]">
                  Rubro
                </TableHead>
                <TableHead className="font-semibold text-center whitespace-nowrap bg-[#00205B] text-white w-[12%]">
                  Puntaje Priorizacion Relativo
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="text-center">
                  Puntaje por depreciación del edificio 
                </TableCell>
                <TableCell className="text-center font-bold bg-yellow-100">
                  {puntajeDepreciacionTotal}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-center">
                  Puntaje por estado de los componentes y sistemas del edificio
                </TableCell>
                <TableCell className="text-center font-bold bg-yellow-100">
                  {puntajeComponentes}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-center">
                  Puntaje por Serviciabilidad
                </TableCell>
                <TableCell className="text-center font-bold bg-yellow-100">
                  {puntajeSeviciabilidad}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-center font-bold">
                  PUNTAJE TOTAL DEL EDIFICIO
                </TableCell>
                <TableCell className="text-center font-bold bg-yellow-100">
                  {puntajeTotalEdificio}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <h1 className="text-2xl font-bold text-center mb-8">Comentarios:</h1>
        
        <div>
          <Table>
          <TableBody>
              <TableRow>
                <TableCell className="font-semibold text-center whitespace-nowrap text-black w-[2%]">
                  Funcionalidad 
                </TableCell>
                <TableCell className="font-semibold text-center whitespace-nowrap text-black w-[50%]">
                <textarea className="w-full h-20 px-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Ingrese los elementos a valorar"></textarea>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold text-center whitespace-nowrap text-black w-[2%]">
                  Normativa 
                </TableCell>
                <TableCell className="font-semibold text-center whitespace-nowrap text-black w-[50%]">
                <textarea className="w-full h-20 px-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Ingrese los elementos a valorar"></textarea>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold text-center whitespace-nowrap text-black w-[2%]">
                  Componentes Criticos 
                </TableCell>
                <TableCell className="font-semibold text-center whitespace-nowrap text-black w-[50%]">
                <textarea 
                  className="w-full h-20 px-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" 
                  placeholder="Ingrese los elementos a valorar"></textarea>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold text-center whitespace-nowrap text-black w-[2%]">
                  Mejoras Requeridas
                </TableCell>
                <TableCell className="font-semibold text-center whitespace-nowrap text-black w-[50%]">
                  <textarea className="w-full h-20 px-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Ingrese los elementos a valorar"></textarea>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold text-center whitespace-nowrap text-black w-[2%]">
                  Registro Fotográfico
                </TableCell>1
                <TableCell className="font-semibold text-center whitespace-nowrap text-black w-[50%]">
                  <textarea className="w-full h-20 px-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Ingrese los elementos a valorar"></textarea>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>


        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" type="reset" className="px-6 text-gray-700 border-gray-300 hover:bg-gray-100">Limpiar</Button>
          <Button type="submit" className="px-6 bg-[#00205B] hover:bg-[#003080] text-white">Guardar</Button>
        </div>
      </form>
    </div>
  );
}
