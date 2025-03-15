import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"

interface BuildingCardProps {
  building: {
    nombre: string
    codigo: string
    estado: string
    ultimaEval: string
  }
}

export default function BuildingCard({ building }: BuildingCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{building.nombre}</CardTitle>
        <CardDescription>Código: {building.codigo}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-muted-foreground">Estado:</div>
          <div
            className={`font-medium ${
              building.estado === "Excelente"
                ? "text-green-500"
                : building.estado === "Bueno"
                  ? "text-blue-500"
                  : building.estado === "Regular"
                    ? "text-yellow-500"
                    : "text-red-500"
            }`}
          >
            {building.estado}
          </div>
          <div className="text-muted-foreground">Última evaluación:</div>
          <div>{building.ultimaEval}</div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Ver Detalles
        </Button>
      </CardFooter>
    </Card>
  )
}

