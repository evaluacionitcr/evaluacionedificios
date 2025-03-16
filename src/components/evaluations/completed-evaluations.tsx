import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"

export default function CompletedEvaluations() {
  const completedEvaluations = [
    {
      building: "Facultad de Ingeniería",
      date: "15 de Enero, 2025",
      type: "Evaluación Completa",
      result: "Excelente (85%)",
      evaluator: "Ing. Roberto Gómez",
    },
    {
      building: "Biblioteca Central",
      date: "5 de Febrero, 2025",
      type: "Evaluación Completa",
      result: "Excelente (90%)",
      evaluator: "Arq. María Rodríguez",
    },
  ]

  return (
    <>
      {completedEvaluations.map((evaluation, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{evaluation.building}</CardTitle>
            <CardDescription>Completada: {evaluation.date}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">Tipo:</div>
              <div>{evaluation.type}</div>
              <div className="text-muted-foreground">Resultado:</div>
              <div className="text-green-500">{evaluation.result}</div>
              <div className="text-muted-foreground">Evaluador:</div>
              <div>{evaluation.evaluator}</div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Ver Informe Completo
            </Button>
          </CardFooter>
        </Card>
      ))}
    </>
  )
}

