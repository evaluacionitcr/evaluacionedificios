"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ComponentesTabs from "~/components/edificios/componentes-tabs";
import type { DatosFijos } from "~/utils/consts";

export default function ComponentesPage() {
  const params = useParams();
  const [datosFijos, setDatosFijos] = useState<DatosFijos | undefined>(
    undefined,
  );

  useEffect(() => {
    const id = params?.id;
    if (!id) return;

    const fetchUsosActuales = async () => {
      try {
        const response = await fetch(`/api/datosEdificio/${id.toString()}`);
        const data = (await response.json()) as DatosFijos;
        if (response.ok) {
          setDatosFijos(data);
        } else {
          console.error("Error al cargar datos fijos:", data);
        }
      } catch (error) {
        console.error("Error al cargar usos actuales:", error);
      }
    };

    void fetchUsosActuales();
  }, [params?.id]);

  if (!params) {
    return <div>Error: Parámetros no disponibles</div>;
  }

  const id = params.id;
  if (!id) {
    return <div>Error: No se encontró el ID del edificio</div>;
  }

  return (
    <div className="space-y-6">
      <ComponentesTabs codigoEdificio={id.toString()} datosFijos={datosFijos} />
    </div>
  );
}
