import { Button } from "~/components/ui/button"
import EvaluationTabs from "~/components/evaluation-tabs"
import Link from "next/link"

export default function EvaluationsView() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Evaluaciones</h1>
        <Link href="/evaluacion">
          <Button>Nueva Evaluación</Button>
        </Link>
      </div>

      <EvaluationTabs />
    </div>
  )
}

