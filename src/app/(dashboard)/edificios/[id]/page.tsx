"use client";

import { useState, useEffect, use } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { ArrowLeft, Building, Calendar, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

interface BuildingPageProps {
  params: Promise<{ id: string }>;
}

export default function BuildingPage({ params }: BuildingPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const [edificios, setEdificios] = useState<EdificioDetalle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para AlertDialog de eliminación de registro
  const [registroToDelete, setRegistroToDelete] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Estado para AlertDialog de eliminación de edificio completo
  const [isDeleteEdificioDialogOpen, setIsDeleteEdificioDialogOpen] =
    useState(false);
  const [isDeletingEdificio, setIsDeletingEdificio] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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
          setError(response.error ?? "Error al cargar los datos");
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

  // Función para abrir el diálogo de confirmación de eliminación de registro
  const openDeleteDialog = (edificioId: number) => {
    setRegistroToDelete(edificioId);
    setIsDeleteDialogOpen(true);
    setDeleteError(null);
  };

  // Función para manejar la eliminación de un registro
  const handleEliminar = async () => {
    if (registroToDelete === null) return;

    try {
      setIsDeleting(true);
      setDeleteError(null);

      const resultado = await eliminarRegistroEdificio(registroToDelete);

      if (resultado.success) {
        // Actualizar la lista de edificios (remover el eliminado)
        setEdificios(edificios.filter((e) => e.id !== registroToDelete));
        setIsDeleteDialogOpen(false);
      } else {
        const errorMessage =
          typeof resultado.error === "string"
            ? resultado.error
            : "Error al eliminar el registro";
        setDeleteError(errorMessage);
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      setDeleteError("Ocurrió un error al eliminar el registro");
    } finally {
      setIsDeleting(false);
    }
  };

  // Función para abrir el diálogo de confirmación de eliminación completa
  const openDeleteEdificioDialog = () => {
    if (edificios.length === 0) return;
    setIsDeleteEdificioDialogOpen(true);
    setDeleteError(null);
  };

  // Función para manejar la eliminación completa del edificio
  const handleEliminarEdificio = async () => {
    if (edificios.length === 0) return;

    // Verificación explícita de que edificio exista antes de usarlo
    const edificio = edificios[0];
    if (!edificio) {
      setDeleteError("No se pudo encontrar información del edificio");
      setIsDeleteEdificioDialogOpen(false);
      return;
    }

    try {
      setIsDeletingEdificio(true);
      setDeleteError(null);

      const resultado = await eliminarEdificioCompleto(edificio.codigoEdificio);

      if (resultado.success) {
        // Redirigir a la página de edificios
        router.push("/edificios");
      } else {
        const errorMessage =
          typeof resultado.error === "string"
            ? resultado.error
            : "Error al eliminar el edificio";
        setDeleteError(errorMessage);
        setIsDeleteEdificioDialogOpen(false);
      }
    } catch (error) {
      console.error("Error al eliminar el edificio:", error);
      setDeleteError("Ocurrió un error al eliminar el edificio");
      setIsDeleteEdificioDialogOpen(false);
    } finally {
      setIsDeletingEdificio(false);
    }
  };

  if (isLoading) {
    return <div>Cargando datos del edificio...</div>;
  }

  if (error || edificios.length === 0) {
    return (
      <div>
        <p className="text-red-500">
          {error ?? "No se encontraron datos para este edificio"}
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
          <Button
            variant="destructive"
            size="sm"
            onClick={openDeleteEdificioDialog}
            disabled={isDeletingEdificio}
            className="bg-[#EF3340] hover:bg-red-700"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar Edificio
          </Button>
        </div>
      </div>

      {deleteError && (
        <div className="mt-2 rounded bg-red-100 p-2 text-red-700">
          {deleteError}
        </div>
      )}

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
                          onClick={() => openDeleteDialog(e.id)}
                          variant="destructive"
                          size="sm"
                          title="Eliminar registro"
                          className="bg-[#EF3340] hover:bg-red-700"
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

      {/* AlertDialog para eliminar un registro */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente este registro y no se puede
              deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void handleEliminar();
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* AlertDialog para eliminar un edificio completo */}
      <AlertDialog
        open={isDeleteEdificioDialogOpen}
        onOpenChange={setIsDeleteEdificioDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>⚠️ ADVERTENCIA</AlertDialogTitle>
            <AlertDialogDescription>
              Está a punto de eliminar TODOS los registros del edificio{" "}
              {edificio.nombre}. Esta acción es irreversible y eliminará todo el
              historial.
              <br />
              <br />
              <strong>¿Está completamente seguro que desea continuar?</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingEdificio}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void handleEliminarEdificio();
              }}
              disabled={isDeletingEdificio}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeletingEdificio ? "Eliminando..." : "Eliminar Edificio"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
