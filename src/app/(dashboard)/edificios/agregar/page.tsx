"use client";
import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import {
  fetchSedes,
  fetchFincas,
  fetchUsosActuales,
  createEdificio,
  checkCodigoEdificioExists,
} from "./actions"; // Importar la función para obtener sedes
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
  codigoEdificio?: string;
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

export default function CreateEdificioPage() {
  const router = useRouter(); // Inicializar el router
  const [codigoEdificio, setCodigoEdificio] = useState("");
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
  const [sedes, setSedes] = useState<Sede[]>([]); // Estado para almacenar las sedes
  const [fincas, setFincas] = useState<Finca[]>([]); // Estado para almacenar las sedes y fincas
  const [usosActuales, setUsosActuales] = useState<UsoActual[]>([]); // Estado para almacenar los usos actuales
  const [tipoCambio, setTipoCambio] = useState(""); // Estado para almacenar el tipo de cambio
  const [anioCalculoEdad, setAnioCalculoEdad] = useState("");
  const [nuevaSede, setNuevaSede] = useState("");
  const [mostrarNuevaSede, setMostrarNuevaSede] = useState(false);
  const [nuevaFinca, setNuevaFinca] = useState("");
  const [mostrarNuevaFinca, setMostrarNuevaFinca] = useState(false);

  const [loading, setLoading] = useState(false); // Estado para manejar el estado de carga
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [sedeEsNueva, setSedeEsNueva] = useState(false); // Estado para controlar si se seleccionó "Nueva Sede..."
  const [fincaEsNueva, setFincaEsNueva] = useState(false); // Estado para controlar si se seleccionó "Nueva Finca..."

  const formatNumber = (value: string) => {
    if (!value) return null;
    // Remove thousand separators and replace comma with period
    return value.replace(/\./g, "").replace(",", ".");
  };

  // Calcula automáticamente el valor IR
  useEffect(() => {
    const m2 = parseFloat(metrosCuadrados.replace(/\./g, "").replace(",", "."));
    const dolar = parseFloat(valorDolarM2.replace(/\./g, "").replace(",", "."));

    if (!isNaN(m2) && !isNaN(dolar)) {
      setValorEdificioIR(m2 * dolar);
    } else {
      setValorEdificioIR(0);
    }
  }, [metrosCuadrados, valorDolarM2]);

  // Calcular Depreciación Anual
  useEffect(() => {
    const vidaUtil = parseFloat(
      vidaUtilHacienda.replace(/\./g, "").replace(",", "."),
    );

    if (valorEdificioIR > 0 && !isNaN(vidaUtil) && vidaUtil > 0) {
      setDepreciacionAnual(valorEdificioIR / vidaUtil);
    } else {
      setDepreciacionAnual(0);
    }
  }, [valorEdificioIR, vidaUtilHacienda]);

  // Cálculo: Edad
  useEffect(() => {
    const anio = parseInt(anioConstruccion);
    const anioBase = parseInt(anioCalculoEdad);
    setEdad(!isNaN(anio) && !isNaN(anioBase) ? anioBase - anio : 0);
  }, [anioConstruccion, anioCalculoEdad]);

  // Cálculo: Valor Actual Revaluado
  useEffect(() => {
    const vidaHacienda = parseFloat(
      vidaUtilHacienda.replace(/\./g, "").replace(",", "."),
    );
    const vidaExperto = parseFloat(
      vidaUtilExperto.replace(/\./g, "").replace(",", "."),
    );

    if (!isNaN(vidaHacienda) && vidaHacienda > 0 && !isNaN(vidaExperto)) {
      const valor = (valorEdificioIR / vidaHacienda) * vidaExperto;
      setValorRevaluado(valor);
    } else {
      setValorRevaluado(0);
    }
  }, [valorEdificioIR, vidaUtilHacienda, vidaUtilExperto]);

  // Calcular Valor en Colones por m²
  useEffect(() => {
    // Convertir "10,00" => 10.00 y "615,50" => 615.50
    const dolar = parseFloat(valorDolarM2.replace(/\./g, "").replace(",", "."));
    const cambio = parseFloat(tipoCambio.replace(/\./g, "").replace(",", "."));

    if (!isNaN(dolar) && !isNaN(cambio)) {
      const resultado = dolar * cambio;
      setValorColonM2(resultado.toFixed(2));
    } else {
      setValorColonM2("");
    }
  }, [valorDolarM2, tipoCambio]);

  // Cargar sedes al iniciar el componente
  useEffect(() => {
    const loadSedes = async () => {
      try {
        const response = await fetchSedes();
        setSedes(response.data ?? []);
      } catch (error) {
        console.error("Error al cargar sedes:", error);
      }
    };

    void loadSedes();
  }, []);

  // Cargar fincas al iniciar el componente
  useEffect(() => {
    const loadFincas = async () => {
      try {
        const response = await fetchFincas();
        const mappedFincas = (response.data ?? []).map((finca) => ({
          id: finca.id,
          numero: finca.numero,
        }));
        setFincas(mappedFincas);
      } catch (error) {
        console.error("Error al cargar fincas:", error);
      }
    };

    void loadFincas();
  }, []);

  // Cargar usos actuales al iniciar el componente
  useEffect(() => {
    const loadUsosActuales = async () => {
      try {
        const response = await fetchUsosActuales();
        setUsosActuales(response.data ?? []);
      } catch (error) {
        console.error("Error al cargar usos actuales:", error);
      }
    };
    void loadUsosActuales();
  }, []);

  // Función para validar el formulario
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Validación de campos obligatorios
    if (!codigoEdificio.trim())
      newErrors.codigoEdificio = "El código del edificio es obligatorio";
    if (!nombreEdificio.trim())
      newErrors.nombreEdificio = "El nombre del edificio es obligatorio";
    if (!sedeId && !sedeEsNueva) newErrors.sedeId = "Debe seleccionar una sede";
    if (!nuevaSede && sedeEsNueva) newErrors.sedeId = "Debe ingresar el nombre de la nueva sede";
    if (!fincaSeleccionada && !fincaEsNueva) newErrors.fincaSeleccionada = "Debe seleccionar una finca";
    if (!nuevaFinca && fincaEsNueva) newErrors.fincaSeleccionada = "Debe ingresar el número de la nueva finca";
    if (!usoActual) newErrors.usoActual = "Debe seleccionar un uso actual";

    // Validación de campos numéricos
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

  //Nota: Checkear si un edificio existe y agregar primero sede y finca en caso de que se agregue una nueva
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar formulario antes de enviar
    if (!validateForm()) {
      toast.error("Por favor complete todos los campos obligatorios.");
      return;
    }

    setLoading(true);

    try {
      // Primero verificamos si el código ya existe
      const codigoCheck = await checkCodigoEdificioExists(codigoEdificio);

      // Si el código ya existe, marcarlo como remodelación
      const esRemodelacion = codigoCheck.exists;

      if (esRemodelacion) {
        // Opcionalmente mostrar confirmación al usuario
        const confirmar = confirm(
          "El código de edificio ya existe. ¿Desea continuar y agregarlo como una remodelación?",
        );

        if (!confirmar) {
          setLoading(false);
          return;
        }
      }

      const data = {
        codigoEdificio: codigoEdificio,
        sede: sedeEsNueva ? null : Number(sedeId), 
        nuevaSede: sedeEsNueva ? nuevaSede : null, // Enviamos el nombre de la nueva sede si aplica
        esRenovacion: esRemodelacion, // Aquí marcamos si es remodelación
        nombre: nombreEdificio,
        fechaConstruccion: parseInt(anioConstruccion),
        noFinca: fincaEsNueva ? null : Number(fincaSeleccionada),
        nuevaFinca: fincaEsNueva ? nuevaFinca : null, // Enviamos el número de la nueva finca si aplica
        m2Construccion: parseFloat(formatNumber(metrosCuadrados) ?? "0"),
        valorDolarPorM2: formatNumber(valorDolarM2) ?? "0",
        valorColonPorM2: formatNumber(valorColonM2) ?? "0",
        edadAl2021: edad,
        vidaUtilHacienda: parseInt(vidaUtilHacienda),
        vidaUtilExperto: parseInt(vidaUtilExperto),
        valorEdificioIR: valorEdificioIR.toString(),
        depreciacionLinealAnual: depreciacionAnual.toString(),
        valorActualRevaluado: valorRevaluado.toString(),
        anoDeRevaluacion: parseInt(anioRevaluacion),
        usoActual: parseInt(usoActual),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const response = await createEdificio(data);

      if (response?.success) {
        toast.success(
          "Edificio creado exitosamente. Complete los datos de los componentes.",
        );
        router.push(`/edificios/${codigoEdificio}/componentes`);
      } else {
        toast.error("Error al guardar: " + response?.error);
      }
    } catch (err) {
      console.error("Error inesperado al crear edificio:", err);
      toast.error("Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl rounded-lg bg-white p-8 shadow-md">
      <h1 className="mb-6 text-3xl font-bold">Creación de Edificios</h1>
      <form onSubmit={handleSubmit}>
        <h2 className="mb-4 text-xl font-semibold">Información del Edificio</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Código Edificio */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Código Edificio*
            </label>
            <input
              type="text"
              placeholder="Ej: A1-SC"
              value={codigoEdificio}
              onChange={(e) => setCodigoEdificio(e.target.value)}
              className={`mt-1 w-full rounded-md border ${errors.codigoEdificio ? "border-red-500" : "border-gray-300"} p-2`}
            />
            {errors.codigoEdificio && (
              <p className="mt-1 text-sm text-red-500">
                {errors.codigoEdificio}
              </p>
            )}
          </div>

          {/* Sede */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sede*
            </label>
            <select
              value={sedeEsNueva ? "nueva" : sedeId}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "nueva") {
                  setMostrarNuevaSede(true);
                  setSedeEsNueva(true);
                  setSedeId("");
                } else {
                  setMostrarNuevaSede(false);
                  setSedeEsNueva(false);
                  setSedeId(value);
                }
              }}
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
              <option value="nueva">+ Nueva Sede...</option>
            </select>
            {errors.sedeId && (
              <p className="mt-1 text-sm text-red-500">{errors.sedeId}</p>
            )}
            {mostrarNuevaSede && (
              <input
                type="text"
                placeholder="Nombre de la nueva sede"
                value={nuevaSede}
                onChange={(e) => setNuevaSede(e.target.value)}
                className="mt-2 w-full rounded-md border border-gray-300 p-2"
              />
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
              <p className="mt-1 text-sm text-red-500">
                {errors.nombreEdificio}
              </p>
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
              value={fincaEsNueva ? "nueva" : fincaSeleccionada}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "nueva") {
                  setMostrarNuevaFinca(true);
                  setFincaEsNueva(true);
                  setFincaSeleccionada("");
                } else {
                  setMostrarNuevaFinca(false);
                  setFincaEsNueva(false);
                  setFincaSeleccionada(value);
                }
              }}
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
              <option value="nueva">+ Nueva Finca...</option>
            </select>
            {errors.fincaSeleccionada && (
              <p className="mt-1 text-sm text-red-500">
                {errors.fincaSeleccionada}
              </p>
            )}
            {mostrarNuevaFinca && (
              <input
                type="text"
                placeholder="Número de la nueva finca"
                value={nuevaFinca}
                onChange={(e) => setNuevaFinca(e.target.value)}
                className="mt-2 w-full rounded-md border border-gray-300 p-2"
              />
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
                setValorDolarM2(values.formattedValue); // .value es el número sin formato
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
              {(usosActuales || []).map((uso) => (
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
            {loading ? "Creando..." : "Crear Edificio"}
          </Button>
        </div>
      </form>
    </div>
  );
}
