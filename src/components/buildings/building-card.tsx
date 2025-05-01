// BuildingCard component
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import Link from "next/link";
import { Eye } from "lucide-react";

interface BuildingCardProps {
  building: {
    nombre: string;
    codigo: string;
  };
}

export default function BuildingCard({ building }: BuildingCardProps) {
  // Extraer el ID del código para la navegación
  const buildingId = building.codigo.toLowerCase();

  return (
    <Card className="bg-white shadow-sm transition-shadow hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-primary">{building.nombre}</CardTitle>
        <CardDescription>Código: {building.codigo}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Contenido del card eliminado según la solicitud */}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Link href={`/edificios/${buildingId}`} className="w-full">
          <Button variant="outline" className="w-full">
            <Eye className="mr-2 h-4 w-4" />
            Ver Detalles
          </Button>
        </Link>
        <Link href={`/evaluacion?edificio=${buildingId}`} className="w-full">
          <Button variant="default" className="w-full">
            Evaluar edificio
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
