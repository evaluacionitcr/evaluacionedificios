import { Button } from "~/components/ui/button";
import BuildingList from "~/components/buildings/building-list";
import { getEdificacionesPorSede } from "~/server/actions/edificios";
import BuildingListContainer from "~/components/buildings/building-list";

export default async function BuildingsView() {
  const sedesConEdificios = await getEdificacionesPorSede();
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Edificios</h1>
        <Button>Agregar Edificio</Button>
      </div>

      <div className="container mx-auto py-6">
        <h2 className="mb-6 text-xl font-semibold sm:text-2xl">
          Edificios por Sede
        </h2>
        <BuildingListContainer sedesConEdificios={sedesConEdificios} />
      </div>
    </div>
  );
}
