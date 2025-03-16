import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import Link from "next/link"

interface BuildingCardProps {
  building: {
    nombre: string
    codigo: string
    estado: string
    ultimaEval: string
  }
}

export default function BuildingCard({ building }: BuildingCardProps) {
  // Extraer el ID del código para la navegación
  const buildingId = building.codigo.toLowerCase()

  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-primary">{building.nombre}</CardTitle>
        <CardDescription>Código: {building.codigo}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-muted-foreground">Estado:</div>
          <div
            className={`font-medium ${
              building.estado === "Excelente"
                ? "text-green-600"
                : building.estado === "Bueno"
                  ? "text-blue-600"
                  : building.estado === "Regular"
                    ? "text-yellow-600"
                    : "text-red-600"
            }`}
          >
            {building.estado}
          </div>
          <div className="text-muted-foreground">Última evaluación:</div>
          <div>{building.ultimaEval}</div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/edificios/${buildingId}`} className="w-full">
          <Button variant="outline" className="w-full">
            Ver Detalles
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

