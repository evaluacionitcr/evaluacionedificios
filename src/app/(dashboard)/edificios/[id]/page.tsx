"use client";

import { useState, useEffect, use, Fragment } from "react";
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
import {
  ArrowLeft,
  Building,
  Calendar,
  Trash2,
  ChevronDown,
  ChevronUp,
  Pencil,
} from "lucide-react";
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
import { formatMoney } from "~/lib/utils";
import {
  eliminarRegistroEdificio,
  obtenerDetallesEdificio,
  eliminarEdificioCompleto,
  obtenerDetallesAceras,
  obtenerDetallesTerreno,
  obtenerDetallesZonasVerdes,
} from "./actions";
import { set } from "zod";

interface EdificioDetalle {
  id: number;
  codigoEdificio: string;
  sede: number | null;
  sedeNombre: string | null;
  esRenovacion: boolean | null;
  nombre: string;
  fechaConstruccion: number | null;
  numeroFinca: string | null;
  m2Construccion: number | null;
  valorDolarPorM2: string | null;
  valorColonPorM2: string | null;
  edad: number | null;
  vidaUtilHacienda: number | null;
  vidaUtilExperto: number | null;
  valorReposicion: string | null;
  depreciacionLinealAnual: string | null;
  valorActualRevaluado: string | null;
  anoDeRevaluacion: number | null;
  usoActual: string | null;
}

interface AcerasDetalle {
  id: number;
  idConstruccion: number | null;
  codigoEdificio: string;
  sede: number | null;
  sedeNombre: string | null;
  esRenovacion: boolean | null;
  nombre: string;
  fechaConstruccion: number | null;
  numeroFinca: string | null;
  m2Construccion: number | null;
  valorDolarPorM2: string | null;
  valorColonPorM2: string | null;
  edad: number | null;
  vidaUtilHacienda: number | null;
  vidaUtilExperto: number | null;
  valorReposicion: string | null;
  depreciacionLinealAnual: string | null;
  valorActualRevaluado: string | null;
  anoDeRevaluacion: number | null;
  usoActual: string | null;
}

interface TerrenoDetalle {
  id: number;
  idConstruccion: number | null;
  codigoEdificio: string;
  sede: number | null;
  sedeNombre: string | null;
  esRenovacion: boolean | null;
  nombre: string;
  fechaConstruccion: number | null;
  numeroFinca: string | null;
  m2Construccion: number | null;
  valorDolarPorM2: string | null;
  valorColonPorM2: string | null;
  valorPorcionTerreno: string | null;
  anoDeRevaluacion: number | null;
  usoActual: string | null;
}

interface ZonaVerdeDetalle {
  id: number;
  idConstruccion: number | null;
  codigoEdificio: string;
  sede: number | null;
  sedeNombre: string | null;
  esRenovacion: boolean | null;
  nombre: string;
  fechaConstruccion: number | null;
  numeroFinca: string | null;
  m2Construccion: number | null;
  valorDolarPorM2: string | null;
  valorColonPorM2: string | null;
  edad: number | null;
  vidaUtilHacienda: number | null;
  vidaUtilExperto: number | null;
  valorReposicion: string | null;
  depreciacionLinealAnual: string | null;
  valorActualRevaluado: string | null;
  anoDeRevaluacion: number | null;
  usoActual: string | null;
}

interface DatosEdificioResponse {
  codigoEdificio: string;
  nombre?: string;
  usoActualDescripcion?: string;
  m2Construccion?: number;
  sedeNombre?: string;
}

interface BuildingPageProps {
  params: Promise<{ id: string }>;
}

export default function BuildingPage({ params }: BuildingPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const [edificios, setEdificios] = useState<EdificioDetalle[]>([]);
  const [aceras, setAceras] = useState<AcerasDetalle[]>([]);
  const [terrenos, setTerrenos] = useState<TerrenoDetalle[]>([]);
  const [zonasVerdes, setZonasVerdes] = useState<ZonaVerdeDetalle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para las filas expandidas
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

  // Estado para AlertDialog de eliminación de registro
  const [registroToDelete, setRegistroToDelete] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Estado para AlertDialog de eliminación de edificio completo
  const [isDeleteEdificioDialogOpen, setIsDeleteEdificioDialogOpen] =
    useState(false);
  const [isDeletingEdificio, setIsDeletingEdificio] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [datosJson, setDatosJson] = useState<DatosEdificioResponse | null>(null);
  

  useEffect(() => {
    const cargarCodigo = async () => {
      if (!id) {
        setError("ID no proporcionado");
        setIsLoading(false);
        return;
      }
      try {
        // Primero obtener el código del edificio
        const datosResponse = await fetch(`/api/datosEdificio/${id}`);
        if (!datosResponse.ok) {
          throw new Error('Error al obtener datos del edificio');
        }
        
        const datos = await datosResponse.json() as DatosEdificioResponse;
        
        if (!datos.codigoEdificio) {
          setError("No se encontró el código del edificio");
          return;
        }
        
        setDatosJson(datos);
        console.log("Código del edificio:", datos.codigoEdificio);
      } catch (error) {
        console.error("Error al obtener datos del edificio:", error);
        setError("Error al obtener datos del edificio");
        return;
      }
    };

    void cargarCodigo();  }, [id]);

  // Cargar los datos del edificio al iniciar
  useEffect(() => {
    if (!datosJson?.codigoEdificio) return;
    const cargarDatos = async () => {
      if (!id) {
        setError("ID no proporcionado");
        setIsLoading(false);
        return;
      }
      try {
        const response = await obtenerDetallesEdificio(datosJson.codigoEdificio);
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
  }, [id, datosJson?.codigoEdificio]);

  // Cargar los datos de las aceras al iniciar
  useEffect(() => {
    if (!datosJson?.codigoEdificio) return;
    const cargarDatosAceras = async () => {
      if (!id) {
        setError("ID no proporcionado");
        setIsLoading(false);
        return;
      }

      try {
        const response = await obtenerDetallesAceras(datosJson.codigoEdificio);
        if (response.success && response.data) {
          if (response.data.length === 0) {
            setError("No se encontró las aceras del edificio");
          } else {
            setAceras(response.data);
          }
        } else {
          setError(response.error ?? "Error al cargar los datos");
        }
      } catch (err) {
        setError("Error al cargar los datos de la acera");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    void cargarDatosAceras();
  }, [id, datosJson?.codigoEdificio]);

  // Cargar los datos de los terrenos al iniciar
  useEffect(() => {
    if (!datosJson?.codigoEdificio) return;
    const cargarDatosTerrenos = async () => {
      if (!id) {
        setError("ID no proporcionado");
        setIsLoading(false);
        return;
      }

      try {
        const response = await obtenerDetallesTerreno(datosJson.codigoEdificio);
        if (response.success && response.data) {
          if (response.data.length === 0) {
            setError("No se encontró el terreno del edificio");
          } else {
            setTerrenos(response.data);
          }
        } else {
          setError(response.error ?? "Error al cargar los datos");
        }
      } catch (err) {
        setError("Error al cargar los datos del terreno");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    void cargarDatosTerrenos();
  }, [id, datosJson?.codigoEdificio]);

  // Cargar los datos de las zonas verdes al iniciar
  useEffect(() => {
    if (!datosJson?.codigoEdificio) return;
    const cargarDatosZonasVerdes = async () => {
      if (!id) {
        setError("ID no proporcionado");
        setIsLoading(false);
        return;
      }

      try {
        const response = await obtenerDetallesZonasVerdes(datosJson.codigoEdificio);
        if (response.success && response.data) {
          if (response.data.length === 0) {
            setError("No se encontró la zona verde del edificio");
          } else {
            setZonasVerdes(response.data);
          }
        } else {
          setError(response.error ?? "Error al cargar los datos");
        }
      } catch (err) {
        setError("Error al cargar los datos de la zona verde");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    void cargarDatosZonasVerdes();
  }, [id, datosJson?.codigoEdificio]);

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

  // Función para alternar el estado expandido/colapsado de una fila
  const toggleRowExpansion = (edificioId: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [edificioId]: !prev[edificioId],
    }));
  };

  if (isLoading) {
    return <div>Cargando datos del edificio...</div>;
  }

  if (edificios.length === 0) {
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
          <Link href={`/edificios/${id}/editar`}>
            <Button
              variant="outline"
              size="sm"
              className="bg-primary text-white hover:bg-primary/90"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Editar Edificio
            </Button>
          </Link>
          <Link href={`/edificios/${edificio.id}/componentes`}>
            <Button
              variant="outline"
              size="sm"
              className="bg-primary text-white hover:bg-primary/90"
            >
              <Building className="mr-2 h-4 w-4" />
              Gestionar Componentes
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/edificios/${id}/agregar-remodelacion`)}
            className="bg-primary text-white hover:bg-primary/90"
          >
            <Building className="mr-2 h-4 w-4" />
            Agregar Renovación
          </Button>
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
                    <TableHead className="w-12">Expandir</TableHead>
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
                    <Fragment key={e.id}>
                      <TableRow className="border-t-2 border-primary/10">
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1"
                            onClick={() => toggleRowExpansion(e.id)}
                          >
                            {expandedRows[e.id] ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell className="font-medium">
                          {e.nombre}
                        </TableCell>
                        <TableCell>{e.fechaConstruccion ?? "N/A"}</TableCell>
                        <TableCell>{e.numeroFinca ?? "N/A"}</TableCell>
                        <TableCell>{e.m2Construccion ?? "N/A"}</TableCell>
                        <TableCell>{e.usoActual ?? "N/A"}</TableCell>
                        <TableCell>{formatMoney(e.valorDolarPorM2, "$")}</TableCell>
                        <TableCell>{formatMoney(e.valorColonPorM2)}</TableCell>
                        <TableCell>{formatMoney(e.valorReposicion)}</TableCell>
                        <TableCell>{formatMoney(e.valorActualRevaluado)}</TableCell>
                        <TableCell>{formatMoney(e.depreciacionLinealAnual)}</TableCell>
                        <TableCell>{e.anoDeRevaluacion ?? "N/A"}</TableCell>
                        <TableCell>{e.edad ?? 0} años</TableCell>
                        <TableCell>{e.vidaUtilHacienda ?? 0} años</TableCell>
                        <TableCell>{e.vidaUtilExperto ?? 0} años</TableCell>
                        <TableCell>{e.esRenovacion ? "Sí" : "No"}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => openDeleteDialog(e.id)}
                              variant="destructive"
                              size="sm"
                              title="Eliminar registro"
                              className="bg-[#EF3340] hover:bg-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            {e.esRenovacion && (
                              <>
                                <Link href={`/edificios/${e.id}/editar`}>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    title="Editar renovación"
                                    className="bg-primary text-white hover:bg-primary/90"
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <Link href={`/edificios/${e.id}/componentes`}>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    title="Gestionar componentes"
                                    className="bg-primary text-white hover:bg-primary/90"
                                  >
                                    <Building className="h-4 w-4" />
                                  </Button>
                                </Link>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>

                      {/* Filas expandibles para mostrar información de aceras relacionadas */}
                      {expandedRows[e.id] && (
                        <>
                          {aceras
                            .filter((a) => a.idConstruccion === e.id)
                            .map((acera) => (
                              <TableRow
                                key={`acera-${acera.id}`}
                                className="bg-blue-100 text-sm hover:bg-blue-50"
                              >
                                <TableCell></TableCell>
                                <TableCell className="pl-6 font-medium text-blue-700">
                                  {acera.nombre} (Acera)
                                </TableCell>
                                <TableCell>
                                  {acera.fechaConstruccion ?? "N/A"}
                                </TableCell>
                                <TableCell>
                                  {acera.numeroFinca ?? "N/A"}
                                </TableCell>
                                <TableCell>
                                  {acera.m2Construccion ?? "N/A"}
                                </TableCell>
                                <TableCell>
                                  {acera.usoActual ?? "N/A"}
                                </TableCell>
                                <TableCell>
                                  {formatMoney(acera.valorDolarPorM2, "$")}
                                </TableCell>
                                <TableCell>
                                  {formatMoney(acera.valorColonPorM2)}
                                </TableCell>
                                <TableCell>
                                  {formatMoney(acera.valorReposicion)}
                                </TableCell>
                                <TableCell>
                                  {formatMoney(acera.valorActualRevaluado)}
                                </TableCell>
                                <TableCell>
                                  {formatMoney(acera.depreciacionLinealAnual)}
                                </TableCell>
                                <TableCell>
                                  {acera.anoDeRevaluacion ?? "N/A"}
                                </TableCell>
                                <TableCell>{acera.edad ?? 0} años</TableCell>
                                <TableCell>
                                  {acera.vidaUtilHacienda ?? 0} años
                                </TableCell>
                                <TableCell>
                                  {acera.vidaUtilExperto ?? 0} años
                                </TableCell>
                                <TableCell>
                                  {acera.esRenovacion ? "Sí" : "No"}
                                </TableCell>
                                <TableCell></TableCell>
                              </TableRow>
                            ))}

                          {zonasVerdes
                            .filter((z) => z.idConstruccion === e.id)
                            .map((zonasVerde) => (
                              <TableRow
                                key={`zonaVerde-${zonasVerde.id}`}
                                className="bg-blue-200 text-sm hover:bg-blue-50"
                              >
                                <TableCell></TableCell>
                                <TableCell className="pl-6 font-medium text-blue-700">
                                  {zonasVerde.nombre} (Zona Verde)
                                </TableCell>
                                <TableCell>
                                  {zonasVerde.fechaConstruccion ?? "N/A"}
                                </TableCell>
                                <TableCell>
                                  {zonasVerde.numeroFinca ?? "N/A"}
                                </TableCell>
                                <TableCell>
                                  {zonasVerde.m2Construccion ?? "N/A"}
                                </TableCell>
                                <TableCell>
                                  {zonasVerde.usoActual ?? "N/A"}
                                </TableCell>
                                <TableCell>
                                  {formatMoney(zonasVerde.valorDolarPorM2, "$")}
                                </TableCell>
                                <TableCell>
                                  {formatMoney(zonasVerde.valorColonPorM2)}
                                </TableCell>
                                <TableCell>
                                  {formatMoney(zonasVerde.valorReposicion)}
                                </TableCell>
                                <TableCell>
                                  {formatMoney(zonasVerde.valorActualRevaluado)}
                                </TableCell>
                                <TableCell>
                                  {formatMoney(zonasVerde.depreciacionLinealAnual)}
                                </TableCell>
                                <TableCell>
                                  {zonasVerde.anoDeRevaluacion ?? "N/A"}
                                </TableCell>
                                <TableCell>
                                  {zonasVerde.edad ?? 0} años
                                </TableCell>
                                <TableCell>
                                  {zonasVerde.vidaUtilHacienda ?? 0} años
                                </TableCell>
                                <TableCell>
                                  {zonasVerde.vidaUtilExperto ?? 0} años
                                </TableCell>
                                <TableCell>
                                  {zonasVerde.esRenovacion ? "Sí" : "No"}
                                </TableCell>
                                <TableCell></TableCell>
                              </TableRow>
                            ))}

                          {terrenos
                            .filter((t) => t.idConstruccion === e.id)
                            .map((terreno) => (
                              <TableRow
                                key={`terreno-${terreno.id}`}
                                className="bg-blue-300 text-sm hover:bg-blue-50"
                              >
                                <TableCell></TableCell>
                                <TableCell className="pl-6 font-medium text-blue-700">
                                  {terreno.nombre} (Terreno)
                                </TableCell>
                                <TableCell>
                                  {terreno.fechaConstruccion ?? "N/A"}
                                </TableCell>
                                <TableCell>
                                  {terreno.numeroFinca ?? "N/A"}
                                </TableCell>
                                <TableCell>
                                  {terreno.m2Construccion ?? "N/A"}
                                </TableCell>
                                <TableCell>
                                  {terreno.usoActual ?? "N/A"}
                                </TableCell>
                                <TableCell>
                                  {formatMoney(terreno.valorDolarPorM2, "$")}
                                </TableCell>
                                <TableCell>
                                  {formatMoney(terreno.valorColonPorM2)}
                                </TableCell>
                                <TableCell>
                                  {formatMoney(terreno.valorPorcionTerreno)}
                                </TableCell>
                                <TableCell>
                                  {/* No tiene valor actual equivalente */}
                                  N/A
                                </TableCell>
                                <TableCell>
                                  {/* No tiene depreciación equivalente */}
                                  N/A
                                </TableCell>
                                <TableCell>
                                  {terreno.anoDeRevaluacion ?? "N/A"}
                                </TableCell>
                                <TableCell>
                                  {/* No tiene edad equivalente */}
                                  N/A
                                </TableCell>
                                <TableCell>
                                  {/* No tiene vida útil hacienda equivalente */}
                                  N/A
                                </TableCell>
                                <TableCell>
                                  {/* No tiene vida útil experto equivalente */}
                                  N/A
                                </TableCell>
                                <TableCell>
                                  {terreno.esRenovacion ? "Sí" : "No"}
                                </TableCell>
                                <TableCell></TableCell>
                              </TableRow>
                            ))}
                        </>
                      )}
                    </Fragment>
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
