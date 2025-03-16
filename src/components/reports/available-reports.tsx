import { Button } from "~/components/ui/button"
import { FileText } from "lucide-react"

export default function AvailableReports() {
  const reports = [
    "Reporte de Condición General",
    "Reporte de Mantenimientos",
    "Reporte de Evaluaciones por Edificio",
    "Reporte de Presupuesto",
    "Reporte de Cumplimiento Normativo",
  ]

  return (
    <div className="space-y-2">
      {reports.map((report, index) => (
        <Button key={index} variant="outline" className="w-full justify-start">
          <FileText className="mr-2 h-4 w-4" />
          {report}
        </Button>
      ))}
    </div>
  )
}

