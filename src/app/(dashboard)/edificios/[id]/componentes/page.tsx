"use client";

import { useParams } from "next/navigation";
import ComponentesTabs from "~/components/edificios/componentes-tabs";

export default function ComponentesPage() {
  const params = useParams();

  if (!params) {
    return <div>Error: Parámetros no disponibles</div>;
  }

  const id = params.id;
  if (!id) {
    return <div>Error: No se encontró el ID del edificio</div>;
  }

  return (
    <div className="space-y-6">
      <ComponentesTabs codigoEdificio={id.toString()} />
    </div>
  );
}
