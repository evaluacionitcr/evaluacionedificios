import { Button } from "~/components/ui/button";
import EvaluationTabs from "~/components/evaluations/evaluation-tabs";
import Link from "next/link";

export default function EvaluationsView() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Evaluaciones</h1>
        <Link href="/evaluacion">
          <Button>Nueva Evaluación</Button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <EvaluationTabs />
      </div>
    </div>
  );
}
