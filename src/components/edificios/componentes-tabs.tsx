import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import FormularioAceras from "./formulario-aceras";
import FormularioTerrenos from "./formulario-terrenos";
import FormularioZonasVerdes from "./formulario-zonas-verdes";
import type { DatosFijos } from "~/utils/consts";

interface ComponentData {
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
  edad?: number | null;
  vidaUtilHacienda?: number | null;
  vidaUtilExperto?: number | null;
  valorReposicion?: string | null;
  depreciacionLinealAnual?: string | null;
  valorActualRevaluado?: string | null;
  anoDeRevaluacion: number | null;
  usoActual: number | null;
  valorPorcionTerreno?: string | null;
  noFinca?: string; // Added property to match DatosAceras
}

interface ComponentesTabsProps {
  codigoEdificio: string;
  datosFijos?: DatosFijos;
  componentesExistentes: {
    aceras: ComponentData | null;
    terrenos: ComponentData | null;
    zonasVerdes: ComponentData | null;
  };
}

export default function ComponentesTabs({
  codigoEdificio,
  datosFijos,
  componentesExistentes,
}: ComponentesTabsProps) {
  return (
    <Tabs defaultValue="aceras" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="aceras">
          Aceras {componentesExistentes.aceras ? "(Editar)" : "(Nuevo)"}
        </TabsTrigger>
        <TabsTrigger value="terrenos">
          Terrenos {componentesExistentes.terrenos ? "(Editar)" : "(Nuevo)"}
        </TabsTrigger>
        <TabsTrigger value="zonas-verdes">
          Zonas Verdes {componentesExistentes.zonasVerdes ? "(Editar)" : "(Nuevo)"}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="aceras" className="space-y-4">
        <div className="mx-auto max-w-4xl rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-6 text-2xl font-bold">
            {componentesExistentes.aceras ? "Editar Aceras" : "Nuevas Aceras"}
          </h2>
          <FormularioAceras 
            codigoEdificio={codigoEdificio} 
            datosFijos={datosFijos} 
            datosExistentes={
              componentesExistentes.aceras
                ? { 
                    ...componentesExistentes.aceras, 
                    m2Construccion: componentesExistentes.aceras.m2Construccion ?? 0,
                    valorDolarPorM2: componentesExistentes.aceras.valorDolarPorM2 ?? "",
                    valorColonPorM2: componentesExistentes.aceras.valorColonPorM2 ?? "",
                    edad: componentesExistentes.aceras.edad ?? 0,
                    vidaUtilHacienda: componentesExistentes.aceras.vidaUtilHacienda ?? 0,
                    vidaUtilExperto: componentesExistentes.aceras.vidaUtilExperto ?? 0,
                    valorReposicion: componentesExistentes.aceras.valorReposicion ?? "",
                    depreciacionLinealAnual: componentesExistentes.aceras.depreciacionLinealAnual ?? "",
                    valorActualRevaluado: componentesExistentes.aceras.valorActualRevaluado ?? "",
                    noFinca: componentesExistentes.aceras.noFinca ? Number(componentesExistentes.aceras.noFinca) : null
                  }
                : undefined
            }
          />
        </div>
      </TabsContent>

      <TabsContent value="terrenos" className="space-y-4">
        <div className="mx-auto max-w-4xl rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-6 text-2xl font-bold">
            {componentesExistentes.terrenos ? "Editar Terrenos" : "Nuevos Terrenos"}
          </h2>
          <FormularioTerrenos 
            codigoEdificio={codigoEdificio} 
            datosFijos={datosFijos} 
            datosExistentes={componentesExistentes.terrenos
              ? { 
                id: componentesExistentes.terrenos.id,
                codigoEdificio: componentesExistentes.terrenos.codigoEdificio,
                nombre: componentesExistentes.terrenos.nombre,
                m2Construccion: componentesExistentes.terrenos.m2Construccion ?? 0,
                valorDolarPorM2: componentesExistentes.terrenos.valorDolarPorM2 ?? "",
                valorColonPorM2: componentesExistentes.terrenos.valorColonPorM2 ?? "",
                valorPorcionTerreno: componentesExistentes.terrenos.valorPorcionTerreno ?? "",
                anoDeRevaluacion: componentesExistentes.terrenos.anoDeRevaluacion ?? 0
              }
            : undefined
            }
          />
        </div>
      </TabsContent>

      <TabsContent value="zonas-verdes" className="space-y-4">
        <div className="mx-auto max-w-4xl rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-6 text-2xl font-bold">
            {componentesExistentes.zonasVerdes ? "Editar Zonas Verdes" : "Nuevas Zonas Verdes"}
          </h2>
          <FormularioZonasVerdes 
            codigoEdificio={codigoEdificio} 
            datosFijos={datosFijos} 
            datosExistentes={componentesExistentes.zonasVerdes
              ? { 
                id: componentesExistentes.zonasVerdes.id,
                idConstruccion: componentesExistentes.zonasVerdes.idConstruccion,
                codigoEdificio: componentesExistentes.zonasVerdes.codigoEdificio,
                nombre: componentesExistentes.zonasVerdes.nombre,
                fechaConstruccion: componentesExistentes.zonasVerdes.fechaConstruccion,
                m2Construccion: componentesExistentes.zonasVerdes.m2Construccion ?? 0,
                valorDolarPorM2: componentesExistentes.zonasVerdes.valorDolarPorM2 ?? "",
                valorColonPorM2: componentesExistentes.zonasVerdes.valorColonPorM2 ?? "",
                vidaUtilHacienda: componentesExistentes.zonasVerdes.vidaUtilHacienda ?? 0,
                vidaUtilExperto: componentesExistentes.zonasVerdes.vidaUtilExperto ?? 0,
                valorReposicion: componentesExistentes.zonasVerdes.valorReposicion ?? "",
                depreciacionLinealAnual: componentesExistentes.zonasVerdes.depreciacionLinealAnual ?? "",
                valorActualRevaluado: componentesExistentes.zonasVerdes.valorActualRevaluado ?? "",
                anoDeRevaluacion: componentesExistentes.zonasVerdes.anoDeRevaluacion ?? 0,
                usoActual: componentesExistentes.zonasVerdes.usoActual,
                edad: componentesExistentes.zonasVerdes.edad ?? null,
                noFinca: componentesExistentes.zonasVerdes.noFinca ? Number(componentesExistentes.zonasVerdes.noFinca) : null
              }
            : undefined
            }
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}
