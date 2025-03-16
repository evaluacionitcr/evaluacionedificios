import { Button } from "~/components/ui/button"

export default function UpcomingEvaluations() {
  const evaluations = [
    { building: "Facultad de Medicina", date: "15 de Marzo, 2025", color: "bg-red-500" },
    { building: "Laboratorios de Química", date: "22 de Marzo, 2025", color: "bg-yellow-500" },
    { building: "Centro Deportivo", date: "28 de Marzo, 2025", color: "bg-green-500" },
    { building: "Residencias Estudiantiles", date: "2 de Abril, 2025", color: "bg-blue-500" },
  ]

  return (
    <div className="space-y-4">
      {evaluations.map((evaluation, index) => (
        <div key={index} className="flex items-center">
          <div className={`w-2 h-2 rounded-full ${evaluation.color} mr-2`}></div>
          <div className="flex-1">
            <div className="text-sm font-medium">{evaluation.building}</div>
            <div className="text-xs text-muted-foreground">{evaluation.date}</div>
          </div>
          <Button variant="outline" size="sm">
            Ver
          </Button>
        </div>
      ))}
    </div>
  )
}

