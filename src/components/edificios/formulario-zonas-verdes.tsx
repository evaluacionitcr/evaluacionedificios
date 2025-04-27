import { NumericFormat } from "react-number-format";
import { useState, useEffect } from "react";
import type { DatosFijos } from "~/utils/consts";
import { createZonasVerdes } from "~/server/actions/components";
import { toast } from "sonner";         

interface FormularioZonasVerdesProps {
  codigoEdificio: string;
  construccionData?: {
    usoActual: number | null;
    numeroFinca: string | null;
  };
  datosFijos?: DatosFijos;
}

export default function FormularioZonasVerdes({
  codigoEdificio,
  datosFijos,
}: FormularioZonasVerdesProps) {
  const [nombre] = useState(""); // Removed unused setNombre
  const [m2Construccion, setM2Construccion] = useState("");
  const [valorDolarM2, setValorDolarM2] = useState("");
  const [valorColonM2, setValorColonM2] = useState("");
  const [edad, setEdad] = useState(0);
  const [anioCalculoEdad, setAnioCalculoEdad] = useState("");
  const [vidaUtilHacienda, setVidaUtilHacienda] = useState("");
  const [vidaUtilExperto, setVidaUtilExperto] = useState("");
  const [valorReposicion, setValorReposicion] = useState(0);
  const [depreciacionAnual, setDepreciacionAnual] = useState(0);
  const [valorRevaluado, setValorRevaluado] = useState(0);
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

  const calcularValorReposicion = () => {
    const m2 = parseFloat(m2Construccion.replace(/\./g, "").replace(",", "."));
    const dolar = parseFloat(valorDolarM2.replace(/\./g, "").replace(",", "."));

    if (!isNaN(m2) && !isNaN(dolar)) {
      setValorReposicion(m2 * dolar);
    }
  };

  const calcularDepreciacionAnual = () => {
    const vidaUtil = parseFloat(
      vidaUtilHacienda.replace(/\./g, "").replace(",", "."),
    );

    if (valorReposicion > 0 && !isNaN(vidaUtil) && vidaUtil > 0) {
      setDepreciacionAnual(valorReposicion / vidaUtil);
    }
  };

  const calcularValorRevaluado = () => {
    const vidaHacienda = parseFloat(
      vidaUtilHacienda.replace(/\./g, "").replace(",", "."),
    );
    const vidaExperto = parseFloat(
      vidaUtilExperto.replace(/\./g, "").replace(",", "."),
    );

    if (!isNaN(vidaHacienda) && vidaHacienda > 0 && !isNaN(vidaExperto)) {
      const valor = (valorReposicion / vidaHacienda) * vidaExperto;
      setValorRevaluado(valor);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Formatear números para la base de datos
    const formatNumber = (value: string) => {
      if (!value) return null;
      return parseFloat(value.replace(/\./g, "").replace(",", "."));
    };

    const data = {
      idConstruccion: datosFijos?.id ?? null,
      codigoEdificio,
      nombre: "Porción de Zonas verdes",
      m2Construccion: formatNumber(m2Construccion) ?? 0,
      fechaConstruccion: datosFijos?.fechaConstruccion ?? null,
      valorDolarPorM2: formatNumber(valorDolarM2) ?? "0",
      valorColonPorM2: formatNumber(valorColonM2) ?? "0",
      edad,
      vidaUtilHacienda: parseInt(vidaUtilHacienda),
      vidaUtilExperto: parseInt(vidaUtilExperto),
      valorReposicion: parseFloat(valorReposicion.toString()),
      depreciacionLinealAnual: parseFloat(depreciacionAnual.toString()),
      valorActualRevaluado: parseFloat(valorRevaluado.toString()),
      anoDeRevaluacion: parseInt(anoRevaluacion),
      noFinca: datosFijos?.noFincaId ?? null,
      usoActual: datosFijos?.usoActualId ?? null,
    };

    try {
      const result = await createZonasVerdes(data);
      if (result.success) {
        toast.success("Zona verde guardada exitosamente", {
          description: "Los datos de la zona verde se han guardado correctamente.",
        });
        // Mostrar mensaje de éxito
        console.log("Zona verde guardada exitosamente");
        // Aquí podrías agregar una notificación de éxito
      } else {
        toast.error("Error al guardar la zona verde", {
          description: "Ocurrió un error al guardar los datos de la zona verde.",
        });
        console.error("Error al guardar:", result.error);
        // Aquí podrías agregar una notificación de error
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      // Aquí podrías agregar una notificación de error
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
          value={"Porción de Zonas verdes"}
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
            calcularValorReposicion();
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
            calcularValorReposicion();
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
          required
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
          Vida Útil Hacienda (años)
        </label>
        <input
          type="number"
          value={vidaUtilHacienda}
          onChange={(e) => {
            setVidaUtilHacienda(e.target.value);
            calcularDepreciacionAnual();
            calcularValorRevaluado();
          }}
          required
          className="mt-1 w-full rounded-md border border-gray-300 p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Vida Útil Experto (años)
        </label>
        <input
          type="number"
          value={vidaUtilExperto}
          onChange={(e) => {
            setVidaUtilExperto(e.target.value);
            calcularValorRevaluado();
          }}
          required
          className="mt-1 w-full rounded-md border border-gray-300 p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Valor de Reposición ($)
        </label>
        <NumericFormat
          value={valorReposicion}
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
          Depreciación Lineal Anual ($)
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

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Valor Actual Revaluado ($)
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
