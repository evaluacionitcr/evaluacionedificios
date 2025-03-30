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
      <CardFooter>
        <Link href={`/edificios/${buildingId}`} className="w-full">
          <Button variant="outline" className="w-full">
            Ver Detalles
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
