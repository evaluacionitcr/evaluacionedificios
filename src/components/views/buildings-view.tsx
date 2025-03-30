import { Button } from "~/components/ui/button"
import Link from "next/link";
import BuildingList from "~/components/buildings/building-list"
import { getEdificacionesPorSede } from "~/server/actions/edificios";
import BuildingListContainer from "~/components/buildings/building-list";

export default async function BuildingsView() {
  const sedesConEdificios = await getEdificacionesPorSede();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edificios</h1>
        <Link href="/edificios/agregar">
          <Button>Agregar Edificio</Button>
        </Link>
      </div>

      <div className="container mx-auto py-6">
        <h1 className="mb-6 text-3xl font-bold">Edificios por Sede</h1>
        <BuildingListContainer sedesConEdificios={sedesConEdificios} />
      </div>
    </div>
  );
}

