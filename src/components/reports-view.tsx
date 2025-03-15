import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import AvailableReports from "~/components/available-reports"
import RecentReports from "~/components/recent-reports"

export default function ReportsView() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reportes</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Reportes Disponibles</CardTitle>
            <CardDescription>Seleccione un tipo de reporte para generar</CardDescription>
          </CardHeader>
          <CardContent>
            <AvailableReports />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reportes Recientes</CardTitle>
            <CardDescription>Últimos reportes generados</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentReports />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

