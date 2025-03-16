import { Progress } from "~/components/ui/progress"

export default function BuildingStatusList() {
  const buildings = [
    { name: "Facultad de Ingeniería", value: 85 },
    { name: "Facultad de Ciencias", value: 72 },
    { name: "Biblioteca Central", value: 90 },
    { name: "Edificio Administrativo", value: 65 },
    { name: "Auditorio Principal", value: 78 },
  ]

  return (
    <div className="space-y-4">
      {buildings.map((building, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">{building.name}</div>
            <div className="text-sm text-muted-foreground">{building.value}%</div>
          </div>
          <Progress value={building.value} className="h-2" />
        </div>
      ))}
    </div>
  )
}

