"use client";
import { useState, useEffect, use } from "react";
import React from "react";
import { Button } from "~/components/ui/button";
import {
  fetchSedes,
  fetchFincas,
  fetchUsosActuales,
  updateEdificio,
} from "./actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";

interface Sede {
  id: number;
  nombre: string;
}

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
  sedeId?: string;
  metrosCuadrados?: string;
  valorDolarM2?: string;
  valorColonM2?: string;
  vidaUtilHacienda?: string;
  vidaUtilExperto?: string;
  anioConstruccion?: string;
  fincaSeleccionada?: string;
  usoActual?: string;
  anioRevaluacion?: string;
  tipoCambio?: string;
}

interface EdificioData {
  id: number;
  codigoEdificio: string;
  sede: number | null;
  nombre: string;
  fechaConstruccion: number | null;
  noFinca: number | null;
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
  usoActual: number | null;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

async function getEdificioData(id: string): Promise<ApiResponse<EdificioData[]>> {
  const response = await fetch(`/api/edificios/${id}`);
  const data = await response.json() as ApiResponse<EdificioData[]>;
  return data;
}

export default function EditarEdificioPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [nombreEdificio, setNombreEdificio] = useState("");
  const [sedeId, setSedeId] = useState("");
  const [metrosCuadrados, setMetrosCuadrados] = useState("");
  const [valorDolarM2, setValorDolarM2] = useState("");
  const [valorColonM2, setValorColonM2] = useState("");
  const [vidaUtilHacienda, setVidaUtilHacienda] = useState("");
  const [vidaUtilExperto, setVidaUtilExperto] = useState("");
  const [anioConstruccion, setAnioConstruccion] = useState("");
  const [fincaSeleccionada, setFincaSeleccionada] = useState("");
  const [usoActual, setUsoActual] = useState("");
  const [anioRevaluacion, setAnioRevaluacion] = useState("");
  const [valorEdificioIR, setValorEdificioIR] = useState(0);
  const [depreciacionAnual, setDepreciacionAnual] = useState(0);
  const [edad, setEdad] = useState(0);
  const [valorRevaluado, setValorRevaluado] = useState(0);
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [fincas, setFincas] = useState<Finca[]>([]);
  const [usosActuales, setUsosActuales] = useState<UsoActual[]>([]);
  const [tipoCambio, setTipoCambio] = useState("");
  const [anioCalculoEdad, setAnioCalculoEdad] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Cargar datos del edificio
  useEffect(() => {
    const fetchEdificioData = async () => {
      try {
        const response = await fetch(`/api/edificios/${resolvedParams.id}`);
        const datosJson = (await response.json()) as ApiResponse<EdificioData[]>;

        // Type validation for API response
        if (!isValidEdificioResponse(datosJson)) {
          throw new Error('Respuesta de API inválida');
        }

        const edificio = datosJson.data[0];
        if (!edificio) {
          throw new Error('No se encontró el edificio');
        }

        console.log("Datos del edificio recibidos:", edificio);

        // Set form values with proper null checks and type coercion
        setNombreEdificio(edificio.nombre ?? "");
        setSedeId(edificio.sede?.toString() ?? "");
        setMetrosCuadrados(edificio.m2Construccion?.toString() ?? "");
        setValorDolarM2(edificio.valorDolarPorM2 ?? "");
        setValorColonM2(edificio.valorColonPorM2 ?? "");
        setVidaUtilHacienda(edificio.vidaUtilHacienda?.toString() ?? "");
        setVidaUtilExperto(edificio.vidaUtilExperto?.toString() ?? "");
        setAnioConstruccion(edificio.fechaConstruccion?.toString() ?? "");
        setFincaSeleccionada(edificio.noFinca?.toString() ?? "");
        setUsoActual(edificio.usoActual?.toString() ?? "");
        setAnioRevaluacion(edificio.anoDeRevaluacion?.toString() ?? "");
        setValorEdificioIR(edificio.valorEdificioIR ? parseFloat(edificio.valorEdificioIR) : 0);
        setDepreciacionAnual(edificio.depreciacionLinealAnual ? parseFloat(edificio.depreciacionLinealAnual) : 0);
        setValorRevaluado(edificio.valorActualRevaluado ? parseFloat(edificio.valorActualRevaluado) : 0);
        setEdad(edificio.edadAl2021 ?? 0);
      } catch (error) {
        console.error("Error al cargar datos del edificio:", error);
        toast.error("Error al cargar los datos del edificio");
      }
    };

    void fetchEdificioData();
  }, [resolvedParams.id]);

  // Type guard for API response
  function isValidEdificioResponse(data: unknown): data is ApiResponse<EdificioData[]> {
    return (
      typeof data === 'object' &&
      data !== null &&
      'success' in data &&
      'data' in data &&
      Array.isArray((data as ApiResponse<EdificioData[]>).data)
    );
  }

  // Cargar datos auxiliares (sedes, fincas, usos)
  useEffect(() => {
    const loadData = async () => {
      try {
        const [sedesRes, fincasRes, usosRes] = await Promise.all([
          fetchSedes(),
          fetchFincas(),
          fetchUsosActuales(),
        ]);

        if (sedesRes.success && sedesRes.data) setSedes(sedesRes.data);
        if (fincasRes.success && fincasRes.data) {
          console.log("Fincas cargadas:", fincasRes.data);
          setFincas(fincasRes.data);
        }
        if (usosRes.success && usosRes.data) {
          console.log("Usos actuales cargados:", usosRes.data);
          setUsosActuales(usosRes.data);
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
        toast.error("Error al cargar los datos necesarios");
      }
    };

    void loadData();
  }, []);

  // Cálculos automáticos
  useEffect(() => {
    const m2 = parseFloat(metrosCuadrados.replace(/\./g, "").replace(",", "."));
    const dolar = parseFloat(valorDolarM2.replace(/\./g, "").replace(",", "."));

    if (!isNaN(m2) && !isNaN(dolar)) {
      setValorEdificioIR(m2 * dolar);
    }
  }, [metrosCuadrados, valorDolarM2]);

  useEffect(() => {
    const vidaUtil = parseFloat(
      vidaUtilHacienda.replace(/\./g, "").replace(",", "."),
    );

    if (valorEdificioIR > 0 && !isNaN(vidaUtil) && vidaUtil > 0) {
      setDepreciacionAnual(valorEdificioIR / vidaUtil);
    }
  }, [valorEdificioIR, vidaUtilHacienda]);

  useEffect(() => {
    const anio = parseInt(anioConstruccion);
    const anioBase = parseInt(anioCalculoEdad);
    setEdad(!isNaN(anio) && !isNaN(anioBase) ? anioBase - anio : 0);
  }, [anioConstruccion, anioCalculoEdad]);

  useEffect(() => {
    const vidaHacienda = parseFloat(
      vidaUtilHacienda.replace(/\./g, "").replace(",", "."),
    );
    const vidaExperto = parseFloat(
      vidaUtilExperto.replace(/\./g, "").replace(",", "."),
    );

    if (!isNaN(vidaHacienda) && vidaHacienda > 0 && !isNaN(vidaExperto)) {
      setValorRevaluado((valorEdificioIR / vidaHacienda) * vidaExperto);
    }
  }, [valorEdificioIR, vidaUtilHacienda, vidaUtilExperto]);

  useEffect(() => {
    const dolar = parseFloat(valorDolarM2.replace(/\./g, "").replace(",", "."));
    const cambio = parseFloat(tipoCambio.replace(/\./g, "").replace(",", "."));

    if (!isNaN(dolar) && !isNaN(cambio)) {
      setValorColonM2((dolar * cambio).toFixed(2));
    }
  }, [valorDolarM2, tipoCambio]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!nombreEdificio.trim())
      newErrors.nombreEdificio = "El nombre del edificio es obligatorio";
    if (!sedeId) newErrors.sedeId = "Debe seleccionar una sede";
    if (!fincaSeleccionada)
      newErrors.fincaSeleccionada = "Debe seleccionar una finca";
    if (!usoActual) newErrors.usoActual = "Debe seleccionar un uso actual";
    if (!metrosCuadrados)
      newErrors.metrosCuadrados = "Los metros cuadrados son obligatorios";
    if (!valorDolarM2)
      newErrors.valorDolarM2 = "El valor en dólar por m² es obligatorio";
    if (!tipoCambio) newErrors.tipoCambio = "Debe ingresar el tipo de cambio";
    if (!valorColonM2)
      newErrors.valorColonM2 = "El valor en colón por m² es obligatorio";
    if (!vidaUtilHacienda)
      newErrors.vidaUtilHacienda = "La vida útil según Hacienda es obligatoria";
    if (!vidaUtilExperto)
      newErrors.vidaUtilExperto = "La vida útil según experto es obligatoria";
    if (!anioConstruccion)
      newErrors.anioConstruccion = "El año de construcción es obligatorio";
    if (!anioRevaluacion)
      newErrors.anioRevaluacion = "El año de revaluación es obligatorio";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Por favor complete todos los campos obligatorios.");
      return;
    }

    setLoading(true);

    try {
      const data = {
        sede: Number(sedeId),
        nombre: nombreEdificio,
        fechaConstruccion: parseInt(anioConstruccion),
        noFinca: Number(fincaSeleccionada),
        m2Construccion: parseFloat(metrosCuadrados.replace(/\./g, "").replace(",", ".")),
        valorDolarPorM2: valorDolarM2,
        valorColonPorM2: valorColonM2,
        edadAl2021: edad,
        vidaUtilHacienda: parseInt(vidaUtilHacienda),
        vidaUtilExperto: parseInt(vidaUtilExperto),
        valorEdificioIR: valorEdificioIR.toString(),
        depreciacionLinealAnual: depreciacionAnual.toString(),
        valorActualRevaluado: valorRevaluado.toString(),
        anoDeRevaluacion: parseInt(anioRevaluacion),
        usoActual: parseInt(usoActual),
      };

      console.log("Datos a enviar:", data);

      // Validaciones adicionales
      if (isNaN(data.usoActual)) {
        toast.error("El uso actual seleccionado no es válido");
        return;
      }

      if (isNaN(data.noFinca)) {
        toast.error("La finca seleccionada no es válida");
        return;
      }

      const response = await updateEdificio(resolvedParams.id, data);

      if (response.success) {
        toast.success("Edificio actualizado exitosamente");
        router.push("/edificios");
      } else {
        toast.error("Error al actualizar: " + response.error);
      }
    } catch (error) {
      console.error("Error al actualizar edificio:", error);
      toast.error("Error inesperado al actualizar el edificio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Suspense fallback={<div>Cargando...</div>}>
      <div className="mx-auto max-w-4xl rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-3xl font-bold">Editar Edificio</h1>
        <form onSubmit={handleSubmit}>
          <h2 className="mb-4 text-xl font-semibold">Información del Edificio</h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Código Edificio (solo lectura) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Código Edificio
              </label>
              <input
                type="text"
                value={resolvedParams.id}
                readOnly
                className="mt-1 w-full rounded-md border border-gray-300 bg-gray-100 p-2"
              />
            </div>

            {/* Sede */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Sede*
              </label>
              <select
                value={sedeId}
                onChange={(e) => setSedeId(e.target.value)}
                className={`mt-1 w-full rounded-md border ${errors.sedeId ? "border-red-500" : "border-gray-300"} p-2`}
              >
                <option value="" disabled>
                  Seleccione una sede
                </option>
                {sedes.map((sede) => (
                  <option key={sede.id} value={sede.id.toString()}>
                    {sede.nombre}
                  </option>
                ))}
              </select>
              {errors.sedeId && (
                <p className="mt-1 text-sm text-red-500">{errors.sedeId}</p>
              )}
            </div>

            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nombre del Edificio e Infraestructura*
              </label>
              <input
                type="text"
                value={nombreEdificio}
                onChange={(e) => setNombreEdificio(e.target.value)}
                placeholder="Nombre del edificio"
                className={`mt-1 w-full rounded-md border ${errors.nombreEdificio ? "border-red-500" : "border-gray-300"} p-2`}
              />
              {errors.nombreEdificio && (
                <p className="mt-1 text-sm text-red-500">{errors.nombreEdificio}</p>
              )}
            </div>

            {/* Año de Construcción */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fecha de Construcción*
              </label>
              <input
                type="number"
                value={anioConstruccion}
                onChange={(e) => setAnioConstruccion(e.target.value)}
                className={`mt-1 w-full rounded-md border ${errors.anioConstruccion ? "border-red-500" : "border-gray-300"} p-2`}
              />
              {errors.anioConstruccion && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.anioConstruccion}
                </p>
              )}
            </div>

            {/* No. Finca */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                No./Finca*
              </label>
              <select
                value={fincaSeleccionada}
                onChange={(e) => setFincaSeleccionada(e.target.value)}
                className={`mt-1 w-full rounded-md border ${errors.fincaSeleccionada ? "border-red-500" : "border-gray-300"} p-2`}
              >
                <option value="" disabled>
                  Seleccione una finca
                </option>
                {fincas.map((finca) => (
                  <option key={finca.id} value={finca.id.toString()}>
                    {finca.numero}
                  </option>
                ))}
              </select>
              {errors.fincaSeleccionada && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.fincaSeleccionada}
                </p>
              )}
            </div>

            {/* m² Construcción */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                m² Construcción*
              </label>
              <NumericFormat
                value={metrosCuadrados}
                onValueChange={(values) => {
                  setMetrosCuadrados(values.formattedValue);
                }}
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={2}
                fixedDecimalScale
                allowNegative={false}
                placeholder="Ej: 1.200,50"
                className={`mt-1 w-full rounded-md border ${errors.metrosCuadrados ? "border-red-500" : "border-gray-300"} p-2`}
              />
              {errors.metrosCuadrados && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.metrosCuadrados}
                </p>
              )}
            </div>

            {/* Valor Dólar por m² */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Valor $ por m²*
              </label>
              <NumericFormat
                value={valorDolarM2}
                onValueChange={(values) => {
                  setValorDolarM2(values.formattedValue);
                }}
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={2}
                fixedDecimalScale
                allowNegative={false}
                placeholder="Ej: 10.000,00"
                className={`mt-1 w-full rounded-md border ${errors.valorDolarM2 ? "border-red-500" : "border-gray-300"} p-2`}
              />
              {errors.valorDolarM2 && (
                <p className="mt-1 text-sm text-red-500">{errors.valorDolarM2}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tipo de Cambio (₡/USD)
              </label>
              <NumericFormat
                value={tipoCambio}
                onValueChange={(values) => {
                  setTipoCambio(values.formattedValue);
                }}
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={2}
                fixedDecimalScale
                allowNegative={false}
                placeholder="Ej: 615,50"
                className={`mt-1 w-full rounded-md border ${errors.tipoCambio ? "border-red-500" : "border-gray-300"} p-2`}
              />
              {errors.tipoCambio && (
                <p className="mt-1 text-sm text-red-500">{errors.tipoCambio}</p>
              )}
            </div>

            {/* Valor Colón por m² */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Valor ₡ por m²*
              </label>
              <NumericFormat
                value={valorColonM2}
                displayType="input"
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={2}
                fixedDecimalScale
                readOnly
                className={`mt-1 w-full rounded-md border ${errors.valorColonM2 ? "border-red-500" : "border-gray-300"} bg-gray-100 p-2`}
              />
              {errors.valorColonM2 && (
                <p className="mt-1 text-sm text-red-500">{errors.valorColonM2}</p>
              )}
            </div>

            {/* Año base para cálculo de edad */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Año base para cálculo de edad
              </label>
              <input
                type="number"
                value={anioCalculoEdad}
                onChange={(e) => setAnioCalculoEdad(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 p-2"
              />
            </div>

            {/* Edad calculada */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Edad calculada
              </label>
              <input
                type="text"
                value={edad}
                readOnly
                className="mt-1 w-full rounded-md border border-gray-300 bg-gray-100 p-2"
              />
            </div>

            {/* Vida Útil Hacienda */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Vida Útil Hacienda (años)*
              </label>
              <input
                type="number"
                value={vidaUtilHacienda}
                onChange={(e) => setVidaUtilHacienda(e.target.value)}
                className={`mt-1 w-full rounded-md border ${errors.vidaUtilHacienda ? "border-red-500" : "border-gray-300"} p-2`}
              />
              {errors.vidaUtilHacienda && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.vidaUtilHacienda}
                </p>
              )}
            </div>

            {/* Vida Útil Experto */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Vida Útil Experto esperada (años)*
              </label>
              <input
                type="number"
                value={vidaUtilExperto}
                onChange={(e) => setVidaUtilExperto(e.target.value)}
                className={`mt-1 w-full rounded-md border ${errors.vidaUtilExperto ? "border-red-500" : "border-gray-300"} p-2`}
              />
              {errors.vidaUtilExperto && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.vidaUtilExperto}
                </p>
              )}
            </div>

            {/* Valor Edificio IR (calculado) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Valor de Edificio e Infraestructura reposición ($)
              </label>
              <NumericFormat
                value={valorEdificioIR}
                displayType="input"
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={2}
                fixedDecimalScale
                readOnly
                className="mt-1 w-full rounded-md border border-gray-300 bg-gray-100 p-2"
              />
            </div>

            {/* Depreciación Acumulada */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Depreciación Lineal Anual restante ($)
              </label>
              <NumericFormat
                value={depreciacionAnual}
                displayType="input"
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={2}
                fixedDecimalScale
                readOnly
                className="mt-1 w-full rounded-md border border-gray-300 bg-gray-100 p-2"
              />
            </div>

            {/* Valor Actual Revaluado */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Valor de Edificio ó Infraestructura Actual Revaluado ($)
              </label>
              <NumericFormat
                value={valorRevaluado}
                displayType="input"
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={2}
                fixedDecimalScale
                readOnly
                className="mt-1 w-full rounded-md border border-gray-300 bg-gray-100 p-2"
              />
            </div>

            {/* Año de Revaluación */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Año de Revaluación*
              </label>
              <input
                type="number"
                value={anioRevaluacion}
                onChange={(e) => setAnioRevaluacion(e.target.value)}
                placeholder="2021"
                className={`mt-1 w-full rounded-md border ${errors.anioRevaluacion ? "border-red-500" : "border-gray-300"} p-2`}
              />
              {errors.anioRevaluacion && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.anioRevaluacion}
                </p>
              )}
            </div>

            {/* Uso Actual */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Uso Actual*
              </label>
              <select
                value={usoActual}
                onChange={(e) => setUsoActual(e.target.value)}
                className={`mt-1 w-full rounded-md border ${errors.usoActual ? "border-red-500" : "border-gray-300"} p-2`}
              >
                <option value="" disabled>
                  Seleccione un uso actual
                </option>
                {usosActuales.map((uso) => (
                  <option key={uso.id} value={uso.id}>
                    {uso.descripcion}
                  </option>
                ))}
              </select>
              {errors.usoActual && (
                <p className="mt-1 text-sm text-red-500">{errors.usoActual}</p>
              )}
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-500">* Campos obligatorios</div>

          <div className="mt-8 flex justify-end space-x-4">
            <Link href="/edificios">
              <button
                type="button"
                className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Cancelar
              </button>
            </Link>
            <Button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-blue-300"
              disabled={loading}
            >
              {loading ? "Actualizando..." : "Actualizar Edificio"}
            </Button>
          </div>
        </form>
      </div>
    </React.Suspense>
  );
}