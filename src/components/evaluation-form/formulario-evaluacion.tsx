"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { ArrowLeft } from "lucide-react";
import GeneralInfoSection from "./general-info-section";
import EvaluationDetailsSection from "./evaluation-details-section";
import RecommendationsSection from "./recommendations-section";
import Link from "next/link";

export default function FormularioEvaluacion() {
  const [formData, setFormData] = useState({
    edificio: "",
    fecha: "",
    evaluador: "",
    tipoEvaluacion: "completa",
    condicionGeneral: "bueno",
    observaciones: "",
    recomendaciones: "",
    conclusiones: "",
  });



  
  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);
    // Aquí iría la lógica para enviar los datos
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center">
        <Link href="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Nueva Evaluación de Edificio</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <GeneralInfoSection formData={formData} handleChange={handleChange} />
          <EvaluationDetailsSection
            formData={formData}
            handleChange={handleChange}
          />
          <RecommendationsSection
            formData={formData}
            handleChange={handleChange}
            onSubmit={handleSubmit}
          />
        </div>
      </form>
    </div>
  );
}
