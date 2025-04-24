"use client";

import { Button } from "~/components/ui/button";
import Link from "next/link";
import { useState } from "react";

export default function ParametersView() {
  const [isLoading, setIsLoading] = useState(false);

  const handleInsertData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/insert-data", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Error al insertar datos");
      }

      alert("Datos insertados correctamente");
    } catch (error) {
      console.error("Error:", error);
      alert("Error al insertar datos");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Parámetros</h1>
        <div className="flex gap-2">
          
          <Link href="/parametro">
            <Button>Nuevo Parámetro</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
