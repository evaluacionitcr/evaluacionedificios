"use client";

import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import {
  ArrowLeft,
  Building,
  Calendar,
  Clock,
  MapPin,
  User,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  eliminarRegistroEdificio,
  obtenerDetallesEdificio,
  eliminarEdificioCompleto,
} from "./actions";

interface EdificioDetalle {
  id: number;
  codigoEdificio: string;
  sede: string | null;
  esRenovacion: boolean | null;
  nombre: string;
  fechaConstruccion: number | null;
  numeroFinca: string | null;
  m2Construccion: number | null;
  valorDolarPorM2: string | null;
  valorColonPorM2: string | null;
  edadAl2021: number | null;
  vidaUtilHacienda: number | null;
  vidaUtilExperto: number | null;
  valorEdificioIR: string | null;
  depreciacionLinealAnual: string | null;
  valorActualRevaluado: string | null;
  anoDeRevaluacion: number | null;
  usoActual: string | null;
}

// Definimos la interfaz correcta para las props de la página
interface PageProps {
  params: {
    id: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function BuildingPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = params;
  const [edificios, setEdificios] = useState<EdificioDetalle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar los datos del edificio al iniciar
  useEffect(() => {
    const cargarDatos = async () => {
      if (!id) {
        setError("ID no proporcionado");
        setIsLoading(false);
        return;
      }

      try {
        const response = await obtenerDetallesEdificio(id);
        if (response.success && response.data) {
          if (response.data.length === 0) {
            setError("No se encontró el edificio");
          } else {
            setEdificios(response.data);
          }
        } else {
          setError(response.error || "Error al cargar los datos");
        }
      } catch (err) {
        setError("Error al cargar los datos del edificio");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    void cargarDatos();
  }, [id]);

  // Función para manejar la eliminación de un registro
  const handleEliminar = async (edificioId: number) => {
    // Mostrar confirmación antes de eliminar
    const confirmar = confirm(
      "¿Está seguro que desea eliminar este registro? Esta acción no se puede deshacer.",
    );

    if (!confirmar) return;

    try {
      const resultado = await eliminarRegistroEdificio(edificioId);

      if (resultado.success) {
        // Actualizar la lista de edificios (remover el eliminado)
        setEdificios(edificios.filter((e) => e.id !== edificioId));
        alert("Registro eliminado exitosamente");
      } else {
        alert(`Error: ${resultado.error}`);
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Ocurrió un error al eliminar el registro");
    }
  };

  // Añadir la función para manejar la eliminación completa del edificio
  const handleEliminarEdificio = async () => {
    if (!edificio) return; // Verificar que edificio exista

    // Mostrar confirmación con advertencia clara
    const confirmar = confirm(
      "⚠️ ADVERTENCIA: Está a punto de eliminar TODOS los registros de este edificio. Esta acción es irreversible y eliminará todo el historial. ¿Está seguro que desea continuar?",
    );

    if (!confirmar) return;

    // Segunda confirmación para prevenir eliminaciones accidentales
    const confirmarSegundo = confirm(
      "⚠️ ÚLTIMA ADVERTENCIA: Confirme que realmente desea eliminar TODOS los registros del edificio " +
        edificio.nombre,
    );

    if (!confirmarSegundo) return;

    try {
      setIsLoading(true);
      const resultado = await eliminarEdificioCompleto(edificio.codigoEdificio);

      if (resultado.success) {
        alert(
          `Edificio eliminado exitosamente. Se eliminaron ${resultado.eliminados} registros.`,
        );
        // Redirigir a la página de edificios
        router.push("/edificios");
      } else {
        alert(`Error: ${resultado.error}`);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error al eliminar el edificio:", error);
      alert("Ocurrió un error al eliminar el edificio");
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Cargando datos del edificio...</div>;
  }

  if (error || edificios.length === 0) {
    return (
      <div>
        <p className="text-red-500">
          {error || "No se encontraron datos para este edificio"}
        </p>
        <Link href="/edificios">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a edificios
          </Button>
        </Link>
      </div>
    );
  }

  const edificio = edificios[0];

  // Asegurarse de que el edificio exista
  if (!edificio) {
    return (
      <div>
        <p className="text-red-500">No se encontró información del edificio</p>
        <Link href="/edificios">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a edificios
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/edificios">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5 text-primary" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-primary">{edificio.nombre}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/edificios/agregar?codigoEdificio=${edificio.codigoEdificio}`}
          >
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Agregar Remodelación
            </Button>
          </Link>
          <Button variant="outline" size="sm">
            <Building className="mr-2 h-4 w-4" />
            Editar Edificio
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleEliminarEdificio}
            disabled={isLoading}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar Edificio
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-primary">
              Historial de Registros
            </CardTitle>
            <CardDescription>Registros históricos del edificio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Fecha Const.</TableHead>
                    <TableHead>No. Finca</TableHead>
                    <TableHead>Área (m²)</TableHead>
                    <TableHead>Uso</TableHead>
                    <TableHead>Valor USD/m²</TableHead>
                    <TableHead>Valor CRC/m²</TableHead>
                    <TableHead>Valor IR</TableHead>
                    <TableHead>Valor Actual</TableHead>
                    <TableHead>Depreciación</TableHead>
                    <TableHead>Año Reval.</TableHead>
                    <TableHead>Edad 2021</TableHead>
                    <TableHead>Vida Útil Hacienda</TableHead>
                    <TableHead>Vida Útil Experto</TableHead>
                    <TableHead>Es Renovación</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {edificios.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell>{e.nombre}</TableCell>
                      <TableCell>{e.fechaConstruccion ?? "N/A"}</TableCell>
                      <TableCell>{e.numeroFinca ?? "N/A"}</TableCell>
                      <TableCell>{e.m2Construccion ?? "N/A"}</TableCell>
                      <TableCell>{e.usoActual ?? "N/A"}</TableCell>
                      <TableCell>${e.valorDolarPorM2 ?? "0.00"}</TableCell>
                      <TableCell>₡{e.valorColonPorM2 ?? "0.00"}</TableCell>
                      <TableCell>₡{e.valorEdificioIR ?? "0.00"}</TableCell>
                      <TableCell>₡{e.valorActualRevaluado ?? "0.00"}</TableCell>
                      <TableCell>
                        ₡{e.depreciacionLinealAnual ?? "0.00"}
                      </TableCell>
                      <TableCell>{e.anoDeRevaluacion ?? "N/A"}</TableCell>
                      <TableCell>{e.edadAl2021 ?? 0} años</TableCell>
                      <TableCell>{e.vidaUtilHacienda ?? 0} años</TableCell>
                      <TableCell>{e.vidaUtilExperto ?? 0} años</TableCell>
                      <TableCell>{e.esRenovacion ? "Sí" : "No"}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleEliminar(e.id)}
                          variant="destructive"
                          size="sm"
                          title="Eliminar registro"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
