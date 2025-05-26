import { Building, Car, ClipboardCheck, FileText, Settings } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import StatsCard from "~/components/dashboard/stats-card"
import BuildingStatusList from "~/components/dashboard/building-status-list"
import UpcomingEvaluations from "~/components/dashboard/upcoming-evaluations"
import RankingNewestEvaluations from "~/components/dashboard/ranking-newest-evaluations"

export default function DashboardView() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total de Edificios" value="100" icon={<Building className="h-4 w-4 text-primary" />} />
        <StatsCard title="Edificios en Uso" value="45" icon={<ClipboardCheck className="h-4 w-4 text-primary" />} />
        <StatsCard title="Edificios sin Uso" value="25" icon={<FileText className="h-4 w-4 text-primary" />} />
        <StatsCard title="Edificios en Mantenimiento" value="15" icon={<Settings className="h-4 w-4 text-primary" />} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-primary">Estado General de Edificios</CardTitle>
          </CardHeader>
          <CardContent>
            <BuildingStatusList />
          </CardContent>
        </Card>
        <Card className="col-span-3 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-primary">Próximas Evaluaciones</CardTitle>
            <CardDescription>Evaluaciones programadas para los próximos 30 días</CardDescription>
          </CardHeader>
          <CardContent>
            <UpcomingEvaluations />
          </CardContent>
        </Card>        
        <Card className="col-span-7 bg-white shadow-sm">
          <RankingNewestEvaluations />
        </Card>
      </div>
    </div>
  )
}

