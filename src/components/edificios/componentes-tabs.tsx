import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import FormularioAceras from "./formulario-aceras";
import FormularioTerrenos from "./formulario-terrenos";
import FormularioZonasVerdes from "./formulario-zonas-verdes";
import { DatosFijos } from "~/utils/consts";

interface ComponentesTabsProps {
  codigoEdificio: string;
  datosFijos?: DatosFijos;
}

export default function ComponentesTabs({
  codigoEdificio,
  datosFijos,
}: ComponentesTabsProps) {
  return (
    <Tabs defaultValue="aceras" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="aceras">Aceras</TabsTrigger>
        <TabsTrigger value="terrenos">Terrenos</TabsTrigger>
        <TabsTrigger value="zonas-verdes">Zonas Verdes</TabsTrigger>
      </TabsList>

      <TabsContent value="aceras" className="space-y-4">
        <div className="mx-auto max-w-4xl rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-6 text-2xl font-bold">Aceras</h2>
          <FormularioAceras codigoEdificio={codigoEdificio} datosFijos={datosFijos} />
        </div>
      </TabsContent>

      <TabsContent value="terrenos" className="space-y-4">
        <div className="mx-auto max-w-4xl rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-6 text-2xl font-bold">Terrenos</h2>
          <FormularioTerrenos codigoEdificio={codigoEdificio} datosFijos={datosFijos} />
        </div>
      </TabsContent>

      <TabsContent value="zonas-verdes" className="space-y-4">
        <div className="mx-auto max-w-4xl rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-6 text-2xl font-bold">Zonas Verdes</h2>
          <FormularioZonasVerdes codigoEdificio={codigoEdificio} datosFijos={datosFijos} />
        </div>
      </TabsContent>
    </Tabs>
  );
}
