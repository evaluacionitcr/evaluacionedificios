import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"

export default function PendingEvaluations() {
  const pendingEvaluations = [
    {
      building: "Facultad de Medicina",
      date: "15 de Marzo, 2025",
      type: "Evaluación Estructural",
      responsible: "Ing. Carlos Mendoza",
    },
    {
      building: "Laboratorios de Química",
      date: "22 de Marzo, 2025",
      type: "Evaluación de Seguridad",
      responsible: "Dra. Laura Sánchez",
    },
  ]

  return (
    <>
      {pendingEvaluations.map((evaluation, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{evaluation.building}</CardTitle>
            <CardDescription>Programada para: {evaluation.date}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">Tipo:</div>
              <div>{evaluation.type}</div>
              <div className="text-muted-foreground">Responsable:</div>
              <div>{evaluation.responsible}</div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Reprogramar</Button>
            <Button>Iniciar Evaluación</Button>
          </CardFooter>
        </Card>
      ))}
    </>
  )
}

