"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getUserData } from "~/server/actions/users";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { Eye } from "lucide-react";
import {
    ArrowLeft,
    Building,
    Calendar,
    Trash2,
    ChevronDown,
    ChevronUp,
    Pencil,
  } from "lucide-react";

interface Evaluacion {
    _id: string;
    edificio: {
      codigo: string;
      nombre: string;
      campus: string;
      usoActual: string;
      area: number;
      descripcion: string;
    };
    depreciacion: {
      principal: {
        edad: number;
        vidaUtil: number;
        estadoConservacionCoef: number;
        escalaDepreciacion: number;
      };
      remodelacion: {
        edad: number;
        vidaUtil: number;
        estadoConservacionCoef: number;
        porcentaje: number;
        escalaDepreciacion: number;
      };
      puntajeDepreciacionTotal: number;
    };
    componentes: {
      id: number;
      componente: string;
      peso: number;
      existencia: string;
      necesidadIntervencion: number;
      pesoEvaluado: number;
      puntaje: number;
    }[];
    puntajeComponentes: number;
    serviciabilidad: {
      funcionalidadId: number;
      normativaId: number;
      puntajeServiciabilidad: number;
    };
    puntajeTotalEdificio: number;
    comentarios: {
      funcionalidad: string;
      normativa: string;
      componentesCriticos: string;
      mejorasRequeridas: string;
      registroFotografico: string;
    };
    idEvaluador: string;
    createdAt: string; // o Date si lo parseas
    estado: string;
    revisado: boolean;
    evaluador?: { id: string; firstName: string; lastName: string } | null;
}

interface ResponseData {
  data: Evaluacion[];
  message: string;
  status: string;
}

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
}

interface PageParams {
  id: string;
}

export default function EvaluacionesDeEdificio() {
  const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>([]);
  const params = useParams();
  const codigo = typeof params?.id === 'string' ? params.id : "";

  useEffect(() => {
    async function fetchEvaluaciones() {
      if (!codigo) {
        console.warn("Código no definido");
        return;
      }

      try {
        const response = await fetch("/api/evaluaciones");
        if (!response.ok) {
          throw new Error("Error al obtener evaluaciones");
        }
        
        const responseJson = await response.json() as ResponseData;
        const evaluacionesFiltradas = responseJson.data.filter((evaluacion) => {
          const codigoEvaluacion = Array.isArray(evaluacion.edificio.codigo)
            ? evaluacion.edificio.codigo[0]
            : evaluacion.edificio.codigo;
          
          const normalizedCodigo = typeof codigoEvaluacion === 'string' ? codigoEvaluacion.toLowerCase() : '';
          return normalizedCodigo === codigo.toLowerCase();
        });

        const evaluadoresPromises = evaluacionesFiltradas.map(async (evaluacion) => {
          try {
            const userData = await getUserData(evaluacion.idEvaluador) as UserData;
            return { ...evaluacion, evaluador: userData };
          } catch (error) {
            console.error(`Error al obtener datos del evaluador ${evaluacion.idEvaluador}:`, error);
            return { ...evaluacion, evaluador: null };
          }
        });

        const evaluacionesConEvaluadores = await Promise.all(evaluadoresPromises);
        setEvaluaciones(evaluacionesConEvaluadores);
      } catch (error) {
        console.error("Error al obtener evaluaciones:", error);
      }
    }

    void fetchEvaluaciones();
  }, [codigo]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Link href="/evaluaciones">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5 text-primary" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">
          Evaluaciones del Edificio {(typeof codigo === "string" ? codigo.toUpperCase() : "desconocido")}
        </h1>
      </div>
      <div className="flex justify-end mb-4 bg-white p-4 rounded-lg shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Puntaje Total</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Evaluador</TableHead>
              <TableHead>Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {evaluaciones.length > 0 ? (
              evaluaciones.map((evaluacion) => (
                <TableRow key={evaluacion._id}>
                  <TableCell>
                    {evaluacion.createdAt ? new Date(evaluacion.createdAt).toLocaleDateString() : "No disponible"}
                  </TableCell>
                  <TableCell>
                    {evaluacion.puntajeTotalEdificio ?? "No disponible"}
                  </TableCell>
                  <TableCell>
                    {evaluacion.edificio.descripcion ?? "No disponible"}
                  </TableCell>
                  <TableCell>
                    {evaluacion.estado ?? "No disponible"}
                  </TableCell>
                  <TableCell>
                    {evaluacion.evaluador ? `${evaluacion.evaluador.firstName} ${evaluacion.evaluador.lastName}` : "No disponible"}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/evaluaciones/${evaluacion.edificio.codigo.toLowerCase()}/evaluacion?codigo=${encodeURIComponent(evaluacion._id)}`}
                      passHref
                    >
                      <Button variant="default" className="w-50">
                        Ver evaluaciones <Eye size={16} className="inline-block ml-1" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No hay evaluaciones disponibles para este edificio.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
