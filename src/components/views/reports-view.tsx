import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import AvailableReports from "~/components/reports/available-reports";
import RecentReports from "~/components/reports/recent-reports";

export default function ReportsView() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reportes</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Reportes Disponibles</CardTitle>
            <CardDescription>
              Seleccione un tipo de reporte para generar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <AvailableReports />
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Reportes Recientes</CardTitle>
            <CardDescription>Últimos reportes generados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <RecentReports />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
