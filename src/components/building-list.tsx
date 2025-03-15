import BuildingCard from "./building-card"

export default function BuildingList() {
  const buildings = [
    { nombre: "Facultad de Ingeniería", codigo: "FI-01", estado: "Excelente", ultimaEval: "15/01/2025" },
    { nombre: "Facultad de Ciencias", codigo: "FC-02", estado: "Bueno", ultimaEval: "10/12/2024" },
    { nombre: "Biblioteca Central", codigo: "BC-01", estado: "Excelente", ultimaEval: "05/02/2025" },
    { nombre: "Edificio Administrativo", codigo: "EA-01", estado: "Regular", ultimaEval: "20/11/2024" },
    { nombre: "Auditorio Principal", codigo: "AP-01", estado: "Bueno", ultimaEval: "25/01/2025" },
    { nombre: "Facultad de Medicina", codigo: "FM-01", estado: "Pendiente", ultimaEval: "Pendiente" },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {buildings.map((building, index) => (
        <BuildingCard key={index} building={building} />
      ))}
    </div>
  )
}

