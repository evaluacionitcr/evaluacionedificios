import React, { useEffect, useState } from 'react';

type Componente = {
  id: number;
  nombre: string;
  estado: string;
};

type Comentarios = {
  funcionalidad: string;
  normativa: string;
  componentesCriticos: string;
  mejorasRequeridas: string;
};

type EdificioData = {
  nombre: string;
  direccion: string;
  añoConstruccion: number;
};

type DepreciacionData = {
  puntajeDepreciacionTotal: number;
};

type ServiceabilityData = {
  puntajeServiciabilidad: number;
};

const EvaluacionComponent: React.FC<{ codigo: string }> = ({ codigo }) => {
  const [edificioData, setEdificioData] = useState<EdificioData | null>(null);
  const [componentes, setComponentes] = useState<Componente[]>([]);
  const [depreciacionData, setDepreciacionData] = useState<DepreciacionData | null>(null);
  const [serviceabilityData, setServiceabilityData] = useState<ServiceabilityData | null>(null);
  const [comentarios, setComentarios] = useState<Comentarios>({
    funcionalidad: '',
    normativa: '',
    componentesCriticos: '',
    mejorasRequeridas: ''
  });
  const [puntajeDepreciacionTotal, setPuntajeDepreciacionTotal] = useState<number>(0);
  const [puntajeComponentes, setPuntajeComponentes] = useState<number>(0);
  const [puntajeTotalEdificios, setPuntajeTotalEdificios] = useState<number>(0);
  const [puntajeSeviciabilidad, setPuntajeSeviciabilidad] = useState<number>(0);

  useEffect(() => {
    const fetchEvaluacionData = async () => {
      if (codigo) {
        try {
          const response = await fetch(`/api/datosEvaluacion/${codigo}`);
          if (response.ok) {
            const data = await response.json() as {
              data: {
                edificio: EdificioData;
                componentes: Componente[];
                depreciacion: DepreciacionData;
                serviciabilidad: ServiceabilityData & { puntajeServiciabilidad: number };
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

    fetchEvaluacionData();
  }, [codigo]);

  return (
    <div>
      <h1>Evaluación del Edificio</h1>
      {/* Render data here */}
    </div>
  );
};

export default EvaluacionComponent;