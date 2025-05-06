import { Button } from "~/components/ui/button";
import Link from "next/link";
import { getConstruccionesPorSede } from "~/server/actions/edificios";  
import EvaluatedBuildingsContainer from "~/components/evaluations/evaluation-list";

export default async function EvaluationsView() {
  const sedesConEdificios = await getConstruccionesPorSede();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Evaluaciones</h1>
          <div className="container mx-auto py-6">
          

          <h2 className="mb-6 text-xl font-semibold sm:text-2xl">
            Evaluaciones por Campus/Centro Académico
          </h2>
          <EvaluatedBuildingsContainer sedesConEdificios={sedesConEdificios} />
        </div>
    </div>
  );
}
