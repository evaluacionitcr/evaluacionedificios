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
import { Eye, ClipboardList } from "lucide-react";

interface BuildingCardProps {
  building: {
    codigo: string;
    nombre: string;
    id: number;
  };
}

export default function BuildingCard({ building }: BuildingCardProps) {
  // Extraer el ID del código para la navegación
  const buildingId = building.id;

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
        <Link href={`/parametros/ejemplo?codigo=${buildingId}`} className="w-full">
          <Button variant="default" className="w-full">
            <ClipboardList className="mr-2 h-4 w-4" />
            Evaluar edificio
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
