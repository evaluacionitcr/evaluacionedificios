import { Button } from "~/components/ui/button"
import { FileText } from "lucide-react"

export default function RecentReports() {
  const reports = [
    { name: "Reporte Trimestral de Condición", date: "01/03/2025" },
    { name: "Reporte de Mantenimientos Pendientes", date: "25/02/2025" },
    { name: "Evaluación Facultad de Ingeniería", date: "15/01/2025" },
  ]

  return (
    <div className="space-y-4">
      {reports.map((report, index) => (
        <div key={index} className="flex items-center">
          <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
          <div className="flex-1">
            <div className="text-sm font-medium">{report.name}</div>
            <div className="text-xs text-muted-foreground">Generado: {report.date}</div>
          </div>
          <Button variant="ghost" size="sm">
            <FileText className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}

