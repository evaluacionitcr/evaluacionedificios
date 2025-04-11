"use client";
import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { ArrowLeft, X } from "lucide-react";
import GeneralInfoSection from "./general-info-section";
import EvaluationDetailsSection from "./evaluation-details-section";
import RecommendationsSection from "./recommendations-section";
import Link from "next/link";
import { SimpleUploadButton } from "~/components/evaluation-form/simple-upload-button"; // Ajusta la ruta según sea necesario
import { useUploadThing } from "~/utils/uploadthing";
import Image from "next/image";

// Definir un tipo para las imágenes subidas
interface UploadedImage {
  id: string;
  name: string;
  url: string;
}

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

  // Para pruebas, usaremos un ID de evaluación fijo
  const testEvaluationId = 123; // ID de prueba

  // Estado para almacenar las imágenes subidas
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

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

  // Hook personalizado para manejar la subida de imágenes
  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      if (res && res.length > 0) {
        // Añadir las nuevas imágenes al estado
        const newImages = res.map((file) => ({
          id: crypto.randomUUID(), // Generar un id único
          name: file.name,
          url: file.url,
        }));

        setUploadedImages((prev) => [...prev, ...newImages]);
      }
    },
    onUploadError: (error) => {
      console.error("Error al subir:", error);
    },
  });

  // Función para eliminar una imagen
  const handleRemoveImage = (id: string) => {
    setUploadedImages((images) => images.filter((img) => img.id !== id));
  };

  // Función para manejar la subida de archivos
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);
    await startUpload(files, {
      evaluationId: testEvaluationId,
      description: "Imágenes de prueba para evaluación",
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center">
        <Link href="/evaluaciones">
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

      <div className="mt-6 border-t pt-6">
        <h2 className="mb-4 text-xl font-semibold">
          Imágenes de la evaluación
        </h2>

        <div className="mb-4">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            <span>Subir imágenes</span>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
          {isUploading && (
            <span className="ml-3 text-gray-500">Subiendo...</span>
          )}
        </div>

        {/* Galería de imágenes */}
        {uploadedImages.length > 0 && (
          <div className="mt-4">
            <h3 className="mb-2 text-lg font-medium">
              Imágenes subidas ({uploadedImages.length})
            </h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {uploadedImages.map((image) => (
                <div
                  key={image.id}
                  className="group relative overflow-hidden rounded-md border"
                >
                  <div className="relative aspect-square">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(image.id)}
                    className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="truncate p-2 text-xs">{image.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
