import { NumericFormat } from "react-number-format";
import { useState, useEffect } from "react";
import type { DatosFijos } from "~/utils/consts";

interface FormularioTerrenosProps {
  codigoEdificio: string;
  construccionData?: {
    usoActual: number | null;
    numeroFinca: string | null;
  };
  datosFijos?: DatosFijos;
}

export default function FormularioTerrenos({
  codigoEdificio,
  datosFijos,
}: FormularioTerrenosProps) {
  const [nombre] = useState("");
  const [m2Construccion, setM2Construccion] = useState("");
  const [valorDolarM2, setValorDolarM2] = useState("");
  const [valorColonM2, setValorColonM2] = useState("");
  const [edad, setEdad] = useState(0);
  const [anioCalculoEdad, setAnioCalculoEdad] = useState("");

  const [valorTerreno, setValorTerreno] = useState("");
  const [anoRevaluacion, setAnoRevaluacion] = useState("");
  const [tipoCambio, setTipoCambio] = useState("");

  useEffect(() => {
    const anio = datosFijos?.fechaConstruccion;
    const anioBase = parseInt(anioCalculoEdad);
    if (!anio) return;
    setEdad(!isNaN(anio) && !isNaN(anioBase) ? anioBase - anio : 0);
  }, [datosFijos?.fechaConstruccion, anioCalculoEdad]);

  const calcularValorColon = (valorDolar: string, cambio: string) => {
    const dolar = parseFloat(valorDolar.replace(/\./g, "").replace(",", "."));
    const tCambio = parseFloat(cambio.replace(/\./g, "").replace(",", "."));

    if (!isNaN(dolar) && !isNaN(tCambio)) {
      const resultado = dolar * tCambio;
      setValorColonM2(resultado.toFixed(2));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formatNumber = (value: string) => {
      if (!value) return null;
      return value.replace(/\./g, "").replace(",", ".");
    };

    const data = {
      codigoEdificio,
      nombre: "Terreno",
      fechaConstruccion: datosFijos?.fechaConstruccion ?? null,
      noFinca: datosFijos?.noFincaId ?? null,
      m2Construccion: parseFloat(formatNumber(m2Construccion) ?? "0"),
      valorDolarPorM2: formatNumber(valorDolarM2) ?? "0",
      valorColonPorM2: formatNumber(valorColonM2) ?? "0",
      edad,
      valorTerreno: valorTerreno.toString(),
      anoDeRevaluacion: parseInt(anoRevaluacion),
      usoActual: datosFijos?.usoActualId ?? null,
    };

    try {
      // await createTerreno(data);
      console.log("Datos a guardar:", data);
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-6 md:grid-cols-2"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Código Edificio
        </label>
        <input
          type="text"
          value={codigoEdificio}
          disabled
          className="mt-1 w-full rounded-md border border-gray-300 bg-gray-100 p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nombre
        </label>
        <input
          type="text"
          value={"Terreno"}
          disabled
          className="mt-1 w-full rounded-md border border-gray-300 bg-gray-100 p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Fecha de Construcción
        </label>
        <input
          type="number"
          value={datosFijos?.fechaConstruccion ?? 0}
          disabled
          className="mt-1 w-full rounded-md border border-gray-300 bg-gray-100 p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          No. Finca
        </label>
        <input
          type="text"
          value={datosFijos?.noFinca ?? ""}
          disabled
          className="mt-1 w-full rounded-md border border-gray-300 bg-gray-100 p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          m² Construcción
        </label>
        <NumericFormat
          value={m2Construccion}
          onValueChange={(values) => {
            setM2Construccion(values.formattedValue);
          }}
          required
          thousandSeparator="."
          decimalSeparator=","
          decimalScale={2}
          fixedDecimalScale
          allowNegative={false}
          className="mt-1 w-full rounded-md border border-gray-300 p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Valor $ por m²
        </label>
        <NumericFormat
          value={valorDolarM2}
          onValueChange={(values) => {
            setValorDolarM2(values.formattedValue);
            calcularValorColon(values.formattedValue, tipoCambio);
          }}
          required
          thousandSeparator="."
          decimalSeparator=","
          decimalScale={2}
          fixedDecimalScale
          allowNegative={false}
          className="mt-1 w-full rounded-md border border-gray-300 p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tipo de Cambio (₡/USD)
        </label>
        <NumericFormat
          value={tipoCambio}
          onValueChange={(values) => {
            setTipoCambio(values.formattedValue);
            calcularValorColon(valorDolarM2, values.formattedValue);
          }}
          required
          thousandSeparator="."
          decimalSeparator=","
          decimalScale={2}
          fixedDecimalScale
          allowNegative={false}
          className="mt-1 w-full rounded-md border border-gray-300 p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Valor ₡ por m²
        </label>
        <NumericFormat
          disabled
          value={valorColonM2}
          displayType="input"
          thousandSeparator="."
          decimalSeparator=","
          decimalScale={2}
          fixedDecimalScale
          readOnly
          className="mt-1 w-full rounded-md border border-gray-300 bg-gray-100 p-2"
        />
      </div>

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

      <div>
        <label className="block text-sm font-medium text-gray-700">Edad</label>
        <input
          type="number"
          value={edad}
          disabled
          className="mt-1 w-full rounded-md border border-gray-300 bg-gray-100 p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Valor de la porción del Terreno que cubre la huella del Edificio ($)
        </label>
        <NumericFormat
          value={valorTerreno}
          onValueChange={(values) => {
            setValorTerreno(values.formattedValue);
          }}
          required
          thousandSeparator="."
          decimalSeparator=","
          decimalScale={2}
          fixedDecimalScale
          allowNegative={false}
          className="mt-1 w-full rounded-md border border-gray-300 p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Año de Revaluación
        </label>
        <input
          type="number"
          value={anoRevaluacion}
          onChange={(e) => setAnoRevaluacion(e.target.value)}
          required
          className="mt-1 w-full rounded-md border border-gray-300 p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Uso Actual
        </label>
        <input
          type="text"
          value={datosFijos?.usoActualDescripcion ?? ""}
          disabled
          className="mt-1 w-full rounded-md border border-gray-300 bg-gray-100 p-2"
        />
      </div>

      <div className="flex justify-end space-x-4 md:col-span-2">
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}
