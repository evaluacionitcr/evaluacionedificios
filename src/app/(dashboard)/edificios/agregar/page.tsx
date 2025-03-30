"use client";
import { useState, useEffect } from "react";
//import { createEdificio } from "./actions"; //Agregar actions
import { Button } from "~/components/ui/button";

import { fetchSedes, fetchFincas, fetchUsosActuales } from "./actions"; // Importar la función para obtener sedes
import Link from "next/link";


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

export default function CreateEdificioPage() {
    const [metrosCuadrados, setMetrosCuadrados] = useState("");
    const [valorDolarM2, setValorDolarM2] = useState("");
    const [vidaUtilHacienda, setVidaUtilHacienda] = useState("");
    const [vidaUtilExperto, setVidaUtilExperto] = useState("");
    const [anioConstruccion, setAnioConstruccion] = useState("");
    const [fincaSeleccionada, setFincaSeleccionada] = useState("");
  
    const [valorEdificioIR, setValorEdificioIR] = useState(0);
    const [depreciacionAnual, setDepreciacionAnual] = useState(0);
    const [edad, setEdad] = useState(0);
    const [valorRevaluado, setValorRevaluado] = useState(0);
    const [sedes, setSedes] = useState<Sede[]>([]); // Estado para almacenar las sedes
    const [fincas, setFincas] = useState<Finca[]>([]); // Estado para almacenar las sedes y fincas
    const [usosActuales, setUsosActuales] = useState<UsoActual[]>([]); // Estado para almacenar los usos actuales

    const anioActual = new Date().getFullYear(); // Obtener el año actual

  
    // Calcula automáticamente el valor IR
    useEffect(() => {
        const m2 = parseFloat(metrosCuadrados);
        const dolar = parseFloat(valorDolarM2);
    
        if (!isNaN(m2) && !isNaN(dolar)) {
          setValorEdificioIR(m2 * dolar);
        } else {
          setValorEdificioIR(0);
        }
      }, [metrosCuadrados, valorDolarM2]);

    // Calcular Depreciación Anual
    useEffect(() => {
        const vidaUtil = parseFloat(vidaUtilHacienda);

        if (valorEdificioIR > 0 && !isNaN(vidaUtil) && vidaUtil > 0) {
          setDepreciacionAnual(valorEdificioIR / vidaUtil);
        } else {
          setDepreciacionAnual(0);
        }
    }, [valorEdificioIR, vidaUtilHacienda]);

    // Cálculo: Edad
    useEffect(() => {
      const anio = parseInt(anioConstruccion);
      setEdad(!isNaN(anio) ? 2021 - anio : 0);
    }, [anioConstruccion]);


    // Cálculo: Valor Actual Revaluado
    useEffect(() => {
      const vidaHacienda = parseFloat(vidaUtilHacienda);
      const vidaExperto = parseFloat(vidaUtilExperto);
      if (!isNaN(vidaHacienda) && vidaHacienda > 0 && !isNaN(vidaExperto)) {
        const valor = (valorEdificioIR / vidaHacienda) * vidaExperto;
        setValorRevaluado(valor);
      } else {
        setValorRevaluado(0);
      }
    }, [valorEdificioIR, vidaUtilHacienda, vidaUtilExperto]);    

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

      loadSedes();
    }, []);

    // Cargar fincas al iniciar el componente
    useEffect(() => {
      const loadFincas = async () => {
        try {
          const response = await fetchFincas();
          const mappedFincas = (response.data ?? []).map(finca => ({
            id: finca.id,
            numero: finca.numero
          }));
          setFincas(mappedFincas);
        } catch (error) {
          console.error("Error al cargar fincas:", error);
        }
      };

      loadFincas();
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

      loadUsosActuales();
    }, []);

    return (   
        <div className="mx-auto max-w-4xl rounded-lg bg-white p-8 shadow-md">
          <h1 className="mb-6 text-3xl font-bold">Creación de Edificios</h1>

          <h2 className="mb-4 text-xl font-semibold">Información del Edificio</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Código Edificio */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Código Edificio</label>
              <input
                type="text"
                placeholder="Ej: A1-SC"
                className="mt-1 w-full rounded-md border border-gray-300 p-2"
              />
            </div>

            {/* Sede */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Sede</label>
              <select className="mt-1 w-full rounded-md border border-gray-300 p-2">
                {sedes.map((sede) => (
                  <option key={sede.id} value={sede.id.toString()}>
                    {sede.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                placeholder="Nombre del edificio"
                className="mt-1 w-full rounded-md border border-gray-300 p-2"
              />
            </div>

            {/* Año de Construcción */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Año de Construcción</label>
                <input
                  type="number"
                  value={anioConstruccion}
                  onChange={(e) => setAnioConstruccion(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                />
            </div>

            {/* No. Finca */}
            <div>
              <label className="block text-sm font-medium text-gray-700">No. Finca</label>
              <select
                className="mt-1 w-full rounded-md border border-gray-300 p-2"
                value={fincaSeleccionada}
                onChange={(e) => setFincaSeleccionada(e.target.value)}
              >
                {fincas.map((finca) => (
                  <option key={finca.id} value={finca.numero}>
                    {finca.numero}
                  </option>
                ))}
                <option value="nueva">Nueva Finca</option>
              </select>
            </div>

            {/* Campo adicional si elige "Nueva Finca" */}
            {fincaSeleccionada === "nueva" && (
              <div className="mt-1">
                <label className="block text-sm font-medium text-gray-700">Ingrese nueva finca</label>
                <input
                  type="text"
                  placeholder="Ej: NUEVA-123456"
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                />
              </div>
            )}

            {/* m² Construcción */}
            <div>
              <label className="block text-sm font-medium text-gray-700">m² Construcción</label>
              <input
                type="number"
                value={metrosCuadrados}
                onChange={(e) => setMetrosCuadrados(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 p-2"
              />
            </div>

            {/* Valor Dólar por m² */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Valor Dólar por m²</label>
              <input
                type="number"
                value={valorDolarM2}
                onChange={(e) => setValorDolarM2(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 p-2"
              />
            </div>

            {/* Valor Colón por m² */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Valor Colón por m²</label>
              <input
                type="number"
                placeholder="Ej: 348619.95"
                className="mt-1 w-full rounded-md border border-gray-300 p-2"
              />
            </div>

            {/* Edad al 2021 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Edad al 2021</label>
              <input
                type="text"
                value={edad}
                readOnly
                className="mt-1 w-full rounded-md border border-gray-300 p-2 bg-gray-100"
              />
            </div>

            {/* Vida Útil Hacienda */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Vida Útil Hacienda (años)</label>
              <input
                type="number"
                value={vidaUtilHacienda}
                onChange={(e) => setVidaUtilHacienda(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 p-2"
              />
            </div>

            {/* Vida Útil Experto */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Vida Útil Experto (años)</label>
                <input
                    type="number"
                    value={vidaUtilExperto}
                    onChange={(e) => setVidaUtilExperto(e.target.value)}
                    className="mt-1 w-full rounded-md border border-gray-300 p-2"
                />
            </div>

            {/* Valor Edificio IR (calculado) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Valor Edificio IR</label>
              <input
                type="number"
                value={valorEdificioIR.toFixed(2)}
                readOnly
                className="mt-1 w-full rounded-md border border-gray-300 p-2 bg-gray-100"
              />
            </div>

            {/* Depreciación Acumulada */}
            <div>
                  <label className="block text-sm font-medium text-gray-700">Depreciación Lineal Anual</label>
                <input
                  type="text"
                  value={depreciacionAnual.toFixed(2)}
                  readOnly
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 bg-gray-100"
                />
            </div>

            {/* Valor Actual Revaluado */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Valor Actual Revaluado</label>
              <input
                type="text"
                value={valorRevaluado.toFixed(2)}
                readOnly
                className="mt-1 w-full rounded-md border border-gray-300 p-2 bg-gray-100"
              />
            </div>
            
            {/* Año de Revaluación */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Año de Revaluación</label>
              <input
                type="number"
                placeholder="2021"
                className="mt-1 w-full rounded-md border border-gray-300 p-2"
              />
            </div>
            
            {/* Uso Actual */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Uso Actual</label>
              <select className="mt-1 w-full rounded-md border border-gray-300 p-2">
                {usosActuales.map((uso) => (
                  <option key={uso.id} value={uso.descripcion}>
                    {uso.descripcion}
                  </option>
                ))}
              </select>
            </div>

          </div>
          <div className="mt-8 flex justify-end space-x-4">
            <Link href="/edificios">
              <button 
                type="button" 
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancelar
              </button>
            </Link>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              Guardar edificio
            </button>
          </div>

        </div>
        
    )
}