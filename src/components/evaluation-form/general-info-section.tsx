"use client";

import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

// Define un tipo unión con las claves permitidas
type FormDataKey = "edificio" | "fecha" | "evaluador" | "tipoEvaluacion";

interface GeneralInfoSectionProps {
  formData: {
    edificio: string;
    fecha: string;
    evaluador: string;
    tipoEvaluacion: string;
  };
  handleChange: (field: FormDataKey, value: string) => void;
}

export default function GeneralInfoSection({
  formData,
  handleChange,
}: GeneralInfoSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Información General</CardTitle>
        <CardDescription>
          Ingrese la información básica de la evaluación
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="edificio">Edificio</Label>
            <Select
              value={formData.edificio}
              onValueChange={(value) => handleChange("edificio", value)}
            >
              <SelectTrigger id="edificio">
                <SelectValue placeholder="Seleccionar edificio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fi-01">Facultad de Ingeniería</SelectItem>
                <SelectItem value="fc-02">Facultad de Ciencias</SelectItem>
                <SelectItem value="bc-01">Biblioteca Central</SelectItem>
                <SelectItem value="ea-01">Edificio Administrativo</SelectItem>
                <SelectItem value="ap-01">Auditorio Principal</SelectItem>
                <SelectItem value="fm-01">Facultad de Medicina</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fecha">Fecha de Evaluación</Label>
            <Input
              id="fecha"
              type="date"
              value={formData.fecha}
              onChange={(e) => handleChange("fecha", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="evaluador">Evaluador</Label>
            <Select
              value={formData.evaluador}
              onValueChange={(value) => handleChange("evaluador", value)}
            >
              <SelectTrigger id="evaluador">
                <SelectValue placeholder="Seleccionar evaluador" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rm">Roberto Méndez</SelectItem>
                <SelectItem value="ls">Laura Sánchez</SelectItem>
                <SelectItem value="cm">Carlos Mendoza</SelectItem>
                <SelectItem value="mr">María Rodríguez</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tipo-evaluacion">Tipo de Evaluación</Label>
            <Select
              value={formData.tipoEvaluacion}
              onValueChange={(value) => handleChange("tipoEvaluacion", value)}
            >
              <SelectTrigger id="tipo-evaluacion">
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completa">Evaluación Completa</SelectItem>
                <SelectItem value="estructural">
                  Evaluación Estructural
                </SelectItem>
                <SelectItem value="seguridad">
                  Evaluación de Seguridad
                </SelectItem>
                <SelectItem value="mantenimiento">
                  Evaluación de Mantenimiento
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
