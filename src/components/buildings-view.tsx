import { Button } from "~/components/ui/button"
import BuildingList from "~/components/building-list"

export default function BuildingsView() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Edificios</h1>
        <Button>Agregar Edificio</Button>
      </div>

      <BuildingList />
    </div>
  )
}

