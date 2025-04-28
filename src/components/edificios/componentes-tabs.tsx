import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import FormularioAceras from "./formulario-aceras";
import FormularioTerrenos from "./formulario-terrenos";
import FormularioZonasVerdes from "./formulario-zonas-verdes";
import { DatosFijos } from "~/utils/consts";

interface ComponentesTabsProps {
  codigoEdificio: string;
  datosFijos?: DatosFijos;
  componentesExistentes: {
    aceras: any;
    terrenos: any;
    zonasVerdes: any;
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
            datosExistentes={componentesExistentes.aceras}
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
            datosExistentes={componentesExistentes.terrenos}
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
            datosExistentes={componentesExistentes.zonasVerdes}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}
