"use client";
import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { fetchFincas, fetchUsosActuales, createRemodelacion } from "./actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface Finca {
  id: number;
  numero: string;
}

interface UsoActual {
  id: number;
  descripcion: string;
}

interface ValidationErrors {
  nombreEdificio?: string;
  metrosCuadrados?: string;
  valorDolarM2?: string;
  valorColonM2?: string;
  vidaUtilHacienda?: string;
  vidaUtilExperto?: string;
  anioConstruccion?: string;
  fincaSeleccionada?: string;
  usoActual?: string;
  anioRevaluacion?: string;
}

interface EdificioResponse {
  success: boolean;
  data: Array<{
    codigoEdificio: string;
    sedeId: number | null;
    nombre: string;
  }>;
}

interface RemodelacionFormProps {
  buildingId: string;
}

export function RemodelacionForm({ buildingId }: RemodelacionFormProps) {
  const router = useRouter();
  const [nombreEdificio, setNombreEdificio] = useState("");
  const [metrosCuadrados, setMetrosCuadrados] = useState("");
  const [valorDolarM2, setValorDolarM2] = useState("");
  const [valorColonM2, setValorColonM2] = useState("");
  const [vidaUtilHacienda, setVidaUtilHacienda] = useState("");
  const [vidaUtilExperto, setVidaUtilExperto] = useState("");
  const [anioConstruccion, setAnioConstruccion] = useState("");
  const [fincaSeleccionada, setFincaSeleccionada] = useState("");
  const [usoActual, setUsoActual] = useState("");
  const [anioRevaluacion, setAnioRevaluacion] = useState("");
  const [valorEdificioIR, setValorEdificioIR] = useState("");
  const [depreciacionLinealAnual, setDepreciacionLinealAnual] = useState("");
  const [valorActualRevaluado, setValorActualRevaluado] = useState("");
  const [edadAl2021, setEdadAl2021] = useState("");

  // Estados para los datos del edificio original
  const [edificioOriginal, setEdificioOriginal] = useState<{
    codigoEdificio: string;
    sede: number | null;
    nombre: string;
  } | null>(null);

  // Estados para los datos de las tablas relacionadas
  const [fincas, setFincas] = useState<Finca[]>([]);
  const [usosActuales, setUsosActuales] = useState<UsoActual[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {},
  );

  // Cargar los datos del edificio original y las tablas relacionadas al iniciar
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Cargar datos del edificio original
        const edificioResponse = await fetch(`/api/edificios/${buildingId}`);
        if (!edificioResponse.ok) {
          throw new Error("No se pudo cargar los datos del edificio");
        }
        const edificioData =
          (await edificioResponse.json()) as EdificioResponse;

        console.log("API Response:", edificioData); // Debug log

        const edificio = edificioData.data?.[0];
        if (edificioData.success && edificio) {
          setEdificioOriginal({
            codigoEdificio: edificio.codigoEdificio,
            sede: edificio.sedeId ?? null,
            nombre: edificio.nombre,
          });
        } else {
          throw new Error("No se encontró el edificio");
        }

        // Cargar fincas
        const fincasResponse = await fetchFincas();
        if (fincasResponse.success && fincasResponse.data) {
          setFincas(fincasResponse.data);
        }

        // Cargar usos actuales
        const usosResponse = await fetchUsosActuales();
        if (usosResponse.success && usosResponse.data) {
          setUsosActuales(usosResponse.data);
        }
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setIsLoading(false);
      }
    };

    void cargarDatos();
  }, [buildingId]);

  // Función para validar el formulario
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    let isValid = true;

    if (!nombreEdificio.trim()) {
      errors.nombreEdificio = "El nombre del edificio es requerido";
      isValid = false;
    }

    if (!metrosCuadrados.trim()) {
      errors.metrosCuadrados = "Los metros cuadrados son requeridos";
      isValid = false;
    } else if (isNaN(Number(metrosCuadrados)) ?? Number(metrosCuadrados) <= 0) {
      errors.metrosCuadrados =
        "Los metros cuadrados deben ser un número positivo";
      isValid = false;
    }

    if (!valorDolarM2.trim()) {
      errors.valorDolarM2 = "El valor en dólares por m² es requerido";
      isValid = false;
    } else if (isNaN(Number(valorDolarM2)) ?? Number(valorDolarM2) <= 0) {
      errors.valorDolarM2 =
        "El valor en dólares por m² debe ser un número positivo";
      isValid = false;
    }

    if (!valorColonM2.trim()) {
      errors.valorColonM2 = "El valor en colones por m² es requerido";
      isValid = false;
    } else if (isNaN(Number(valorColonM2)) ?? Number(valorColonM2) <= 0) {
      errors.valorColonM2 =
        "El valor en colones por m² debe ser un número positivo";
      isValid = false;
    }

    if (!vidaUtilHacienda.trim()) {
      errors.vidaUtilHacienda = "La vida útil según Hacienda es requerida";
      isValid = false;
    } else if (
      isNaN(Number(vidaUtilHacienda)) ??
      Number(vidaUtilHacienda) <= 0
    ) {
      errors.vidaUtilHacienda =
        "La vida útil según Hacienda debe ser un número positivo";
      isValid = false;
    }

    if (!vidaUtilExperto.trim()) {
      errors.vidaUtilExperto = "La vida útil según experto es requerida";
      isValid = false;
    } else if (isNaN(Number(vidaUtilExperto)) ?? Number(vidaUtilExperto) <= 0) {
      errors.vidaUtilExperto =
        "La vida útil según experto debe ser un número positivo";
      isValid = false;
    }

    if (!anioConstruccion.trim()) {
      errors.anioConstruccion = "El año de construcción es requerido";
      isValid = false;
    } else if (
      isNaN(Number(anioConstruccion)) ??
      Number(anioConstruccion) <= 0
    ) {
      errors.anioConstruccion =
        "El año de construcción debe ser un número positivo";
      isValid = false;
    }

    if (!fincaSeleccionada) {
      errors.fincaSeleccionada = "Debe seleccionar una finca";
      isValid = false;
    }

    if (!usoActual) {
      errors.usoActual = "Debe seleccionar un uso actual";
      isValid = false;
    }

    if (!anioRevaluacion.trim()) {
      errors.anioRevaluacion = "El año de revaluación es requerido";
      isValid = false;
    } else if (isNaN(Number(anioRevaluacion)) ?? Number(anioRevaluacion) <= 0) {
      errors.anioRevaluacion =
        "El año de revaluación debe ser un número positivo";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !edificioOriginal) {
      return;
    }

    try {
      // Calcular la edad al 2021
      const edad = 2021 - Number(anioConstruccion);
      setEdadAl2021(edad.toString());

      // Calcular el valor del edificio IR
      const valorIR = Number(metrosCuadrados) * Number(valorColonM2);
      setValorEdificioIR(valorIR.toString());

      // Calcular la depreciación lineal anual
      const depreciacion = valorIR / Number(vidaUtilHacienda);
      setDepreciacionLinealAnual(depreciacion.toString());

      // Calcular el valor actual revaluado
      const valorActual =
        valorIR - depreciacion * (2021 - Number(anioRevaluacion));
      setValorActualRevaluado(valorActual.toString());

      // Crear el objeto con los datos del edificio
      const edificioData = {
        codigoEdificio: edificioOriginal.codigoEdificio,
        sede: edificioOriginal.sede ?? null,
        esRenovacion: true,
        nombre: nombreEdificio,
        fechaConstruccion: Number(anioConstruccion),
        noFinca: Number(fincaSeleccionada),
        m2Construccion: Number(metrosCuadrados),
        valorDolarPorM2: valorDolarM2,
        valorColonPorM2: valorColonM2,
        edadAl2021: edad,
        vidaUtilHacienda: Number(vidaUtilHacienda),
        vidaUtilExperto: Number(vidaUtilExperto),
        valorEdificioIR: valorIR.toString(),
        depreciacionLinealAnual: depreciacion.toString(),
        valorActualRevaluado: valorActual.toString(),
        anoDeRevaluacion: Number(anioRevaluacion),
        usoActual: Number(usoActual),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log("Remodeling Data:", edificioData); // Debug log

      // Enviar los datos al servidor
      const response = await createRemodelacion(edificioData);

      if (response.success) {
        // Redirigir al usuario a editar aceras, zonas verdes y terrenos
        toast.success("Remodelación creada con éxito");
        if (response.data ){
          if(response.data[0]){
          router.push(`/edificios/${response.data[0].id}/componentes`);
        }}
      } else {
        setError(response.error ?? "Error al crear la remodelación");
      }
    } catch (err) {
      console.error("Error al crear la remodelación:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  };

  if (isLoading) {
    return <div>Cargando datos...</div>;
  }

  if (error ?? !edificioOriginal) {
    return (
      <div>
        <p className="text-red-500">
          {error ?? "No se pudo cargar el edificio"}
        </p>
        <Link href={`/edificios/${buildingId}`}>
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al edificio
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">
          Agregar Remodelación
        </h1>
        <Link href={`/edificios/${buildingId}`}>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al edificio
          </Button>
        </Link>
      </div>

      <div className="mb-6 rounded-lg bg-blue-50 p-4 text-blue-800">
        <p className="font-medium">
          Edificio original: {edificioOriginal.nombre}
        </p>
        <p>Código: {edificioOriginal.codigoEdificio}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="nombreEdificio"
              className="block text-sm font-medium"
            >
              Nombre del edificio
            </label>
            <input
              id="nombreEdificio"
              type="text"
              value={nombreEdificio}
              onChange={(e) => setNombreEdificio(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2"
              placeholder="Nombre del edificio"
            />
            {validationErrors.nombreEdificio && (
              <p className="text-sm text-red-500">
                {validationErrors.nombreEdificio}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="metrosCuadrados"
              className="block text-sm font-medium"
            >
              Metros cuadrados
            </label>
            <input
              id="metrosCuadrados"
              type="number"
              value={metrosCuadrados}
              onChange={(e) => setMetrosCuadrados(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2"
              placeholder="Metros cuadrados"
            />
            {validationErrors.metrosCuadrados && (
              <p className="text-sm text-red-500">
                {validationErrors.metrosCuadrados}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="valorDolarM2" className="block text-sm font-medium">
              Valor en dólares por m²
            </label>
            <input
              id="valorDolarM2"
              type="number"
              value={valorDolarM2}
              onChange={(e) => setValorDolarM2(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2"
              placeholder="Valor en dólares por m²"
            />
            {validationErrors.valorDolarM2 && (
              <p className="text-sm text-red-500">
                {validationErrors.valorDolarM2}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="valorColonM2" className="block text-sm font-medium">
              Valor en colones por m²
            </label>
            <input
              id="valorColonM2"
              type="number"
              value={valorColonM2}
              onChange={(e) => setValorColonM2(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2"
              placeholder="Valor en colones por m²"
            />
            {validationErrors.valorColonM2 && (
              <p className="text-sm text-red-500">
                {validationErrors.valorColonM2}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="vidaUtilHacienda"
              className="block text-sm font-medium"
            >
              Vida útil según Hacienda (años)
            </label>
            <input
              id="vidaUtilHacienda"
              type="number"
              value={vidaUtilHacienda}
              onChange={(e) => setVidaUtilHacienda(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2"
              placeholder="Vida útil según Hacienda"
            />
            {validationErrors.vidaUtilHacienda && (
              <p className="text-sm text-red-500">
                {validationErrors.vidaUtilHacienda}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="vidaUtilExperto"
              className="block text-sm font-medium"
            >
              Vida útil según experto (años)
            </label>
            <input
              id="vidaUtilExperto"
              type="number"
              value={vidaUtilExperto}
              onChange={(e) => setVidaUtilExperto(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2"
              placeholder="Vida útil según experto"
            />
            {validationErrors.vidaUtilExperto && (
              <p className="text-sm text-red-500">
                {validationErrors.vidaUtilExperto}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="anioConstruccion"
              className="block text-sm font-medium"
            >
              Año de construcción
            </label>
            <input
              id="anioConstruccion"
              type="number"
              value={anioConstruccion}
              onChange={(e) => setAnioConstruccion(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2"
              placeholder="Año de construcción"
            />
            {validationErrors.anioConstruccion && (
              <p className="text-sm text-red-500">
                {validationErrors.anioConstruccion}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="fincaSeleccionada"
              className="block text-sm font-medium"
            >
              Número de finca
            </label>
            <select
              id="fincaSeleccionada"
              value={fincaSeleccionada}
              onChange={(e) => setFincaSeleccionada(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2"
            >
              <option value="">Seleccione una finca</option>
              {fincas.map((finca) => (
                <option key={finca.id} value={finca.id}>
                  {finca.numero}
                </option>
              ))}
            </select>
            {validationErrors.fincaSeleccionada && (
              <p className="text-sm text-red-500">
                {validationErrors.fincaSeleccionada}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="usoActual" className="block text-sm font-medium">
              Uso actual
            </label>
            <select
              id="usoActual"
              value={usoActual}
              onChange={(e) => setUsoActual(e.target.value)}
              className={`mt-1 w-full rounded-md border ${validationErrors.usoActual ? "border-red-500" : "border-gray-300"} p-2`}
            >
              <option value="" disabled>
                Seleccione un uso actual
              </option>
              {(usosActuales ?? []).map((uso) => (
                <option key={uso.id} value={uso.id}>
                  {uso.descripcion}
                </option>
              ))}
            </select>
            {validationErrors.usoActual && (
              <p className="text-sm text-red-500">
                {validationErrors.usoActual}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="anioRevaluacion"
              className="block text-sm font-medium"
            >
              Año de revaluación
            </label>
            <input
              id="anioRevaluacion"
              type="number"
              value={anioRevaluacion}
              onChange={(e) => setAnioRevaluacion(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2"
              placeholder="Año de revaluación"
            />
            {validationErrors.anioRevaluacion && (
              <p className="text-sm text-red-500">
                {validationErrors.anioRevaluacion}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-primary text-white hover:bg-primary/90"
          >
            Crear Remodelación
          </Button>
        </div>
      </form>
    </div>
  );
}
