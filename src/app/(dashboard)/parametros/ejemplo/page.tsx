import { Button } from "~/components/ui/button";

export default function Page() {
  return (
    <div className="container mx-auto py-6 border border-gray-300 rounded-xl">
      <h1 className="text-2xl font-bold text-center mb-8">Evaluación de Edificaciones</h1>
      <form className="space-y-6">
        {/* Fila de Edificio y Código */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="edificio" className="text-base font-medium text-gray-700">Edificio</label>
            <input
              id="edificio"
              placeholder="Ej: Edificio U-11"
              defaultValue="Edificio U-11"
              className="w-full h-11 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="codigo" className="text-base font-medium text-gray-700">Código</label>
            <input
              id="codigo"
              placeholder="Ingrese el código"
              className="w-full h-11 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Fila de Campus Tecnológico y Área */}
        <div className="space-y-2">
          <label htmlFor="campus" className="text-base font-medium text-gray-700">Campus Tecnológico / Centro Académico</label>
          <input
            id="campus"
            placeholder="Ingrese el campus o centro académico"
            className="w-full h-11 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="area" className="text-base font-medium text-gray-700">Área (m²)</label>
            <input
              id="area"
              placeholder="Ingrese el área"
              type="number"
              className="w-full h-11 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="uso" className="text-base font-medium text-gray-700">Uso</label>
            <input
              id="uso"
              placeholder="Ingrese el uso del edificio"
              className="w-full h-11 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Descripción */}
        <div className="space-y-2">
          <label htmlFor="descripcion" className="text-base font-medium text-gray-700">Descripción</label>
          <textarea
            id="descripcion"
            placeholder="Ingrese la descripción detallada del edificio"
            className="w-full min-h-[200px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <h1 className="text-2xl font-bold text-center mb-8">Puntaje por depreciación del edificio</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Encabezados de columnas */}
          <div className="bg-[#00205B] text-white text-center py-3 font-semibold">Edificación Principal</div>
          <div className="bg-[#00205B] text-white text-center py-3 font-semibold">Remodelación</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Columna Edificación Principal */}
          <div className="border-r border-gray-200 p-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="edad-edificio" className="text-base font-medium">Edad de Edificio</label>
              <input id="edad-edificio" defaultValue="45" className="w-full h-11 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="space-y-2">
              <label htmlFor="vida-util-principal" className="text-base font-medium">Vida Útil Esperada</label>
              <input id="vida-util-principal" defaultValue="75" className="w-full h-11 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="space-y-2">
              <label htmlFor="estado-conservacion-principal" className="text-base font-medium">Estado de Conservación</label>
              <select defaultValue="regular" className="w-full h-11 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="optimo">Óptimo (O)</option>
                <option value="bueno">Bueno (B)</option>
                <option value="regular">Regular (R)</option>
                <option value="malo">Malo (M)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="escala-depreciacion-principal" className="text-base font-medium">Escala de depreciación</label>
              <input id="escala-depreciacion-principal" defaultValue="0.57" className="w-full h-11 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          {/* Columna Remodelación */}
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="edad-remodela" className="text-base font-medium">Edad de Remodelación</label>
              <input id="edad-remodela" defaultValue="1" className="w-full h-11 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="space-y-2">
              <label htmlFor="vida-util-remodela" className="text-base font-medium">Vida Útil Esperada</label>
              <input id="vida-util-remodela" defaultValue="55" className="w-full h-11 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="space-y-2">
              <label htmlFor="estado-conservacion-remodela" className="text-base font-medium">Estado de Conservación</label>
              <select defaultValue="optimo" className="w-full h-11 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="optimo">Óptimo (O)</option>
                <option value="bueno">Bueno (B)</option>
                <option value="regular">Regular (R)</option>
                <option value="malo">Malo (M)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="porcentaje-remodelacion" className="text-base font-medium">Porcentaje de Remodelación/Ampliación</label>
              <div className="relative">
                <input id="porcentaje-remodelacion" defaultValue="10" className="w-full h-11 px-4 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2">%</span>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="escala-depreciacion-remodela" className="text-base font-medium">Escala de depreciación Remodelación/Ampliación</label>
              <input id="escala-depreciacion-remodela" defaultValue="0.0033" className="w-full h-11 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        {/* Puntaje Total */}
        <div className="p-4 bg-yellow-100 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <label htmlFor="puntaje-total" className="text-base font-bold">PUNTAJE DE DEPRECIACIÓN TOTAL</label>
            <input id="puntaje-total" defaultValue="0.52" className="w-full md:max-w-[200px] h-11 font-bold text-center" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-8">Puntaje del estado de los componentes y sistemas del edificio</h1>
        

        {/* Botones de acción */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" type="reset" className="px-6 text-gray-700 border-gray-300 hover:bg-gray-100">Limpiar</Button>
          <Button type="submit" className="px-6 bg-[#00205B] hover:bg-[#003080] text-white">Guardar</Button>
        </div>
      </form>
    </div>
  );
}
