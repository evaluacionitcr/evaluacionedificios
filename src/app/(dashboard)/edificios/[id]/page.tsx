// src/app/(dashboard)/edificios/[id]/page.tsx

import { Building, MapPin, Calendar, User, Clock, ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { Button } from "~/components/ui/button";
import Link from "next/link";

type Params = Promise<{ id: string }>;

export default async function EdificioDetallePage(props: { params: Params }) {
  const params = await props.params;
  const id = params.id;

  // Simulación de datos de un edificio (aquí deberías hacer una llamada API o una consulta a base de datos)
  const edificio = {
    id: id,
    nombre: "Facultad de Ingeniería",
    codigo: "FI-01",
    ubicacion: "Campus Central",
    fechaConstruccion: "1985",
    ultimaRenovacion: "2018",
    estado: "Excelente",
    condicion: 85,
    area: "4,500 m²",
    pisos: 4,
    responsable: "Ing. Roberto Méndez",
    ultimaEvaluacion: "15/01/2025",
    proximaEvaluacion: "15/01/2026",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/edificios">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5 text-primary" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-primary">{edificio.nombre}</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-primary">
                Información General
              </CardTitle>
              <CardDescription>Datos básicos del edificio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-start gap-2">
                  <Building className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Código
                    </p>
                    <p>{edificio.codigo}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Ubicación
                    </p>
                    <p>{edificio.ubicacion}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Fecha de Construcción
                    </p>
                    <p>{edificio.fechaConstruccion}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Última Renovación
                    </p>
                    <p>{edificio.ultimaRenovacion}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <User className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Responsable
                    </p>
                    <p>{edificio.responsable}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Última Evaluación
                    </p>
                    <p>{edificio.ultimaEvaluacion}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-primary">Estado Actual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">
                      Condición General
                    </span>
                    <span className="text-sm font-medium text-green-600">
                      {edificio.condicion}%
                    </span>
                  </div>
                  <Progress value={edificio.condicion} className="h-2" />
                </div>
                <div className="border-t pt-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Estado:</div>
                    <div className="font-medium text-green-600">
                      {edificio.estado}
                    </div>
                    <div className="text-muted-foreground">Área:</div>
                    <div>{edificio.area}</div>
                    <div className="text-muted-foreground">Pisos:</div>
                    <div>{edificio.pisos}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
