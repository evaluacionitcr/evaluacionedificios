import { Building, Car, ClipboardCheck, FileText, Settings } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import StatsCard from "~/components/dashboard/stats-card"
import BuildingStatusList from "~/components/dashboard/building-status-list"
import UpcomingEvaluations from "~/components/dashboard/upcoming-evaluations"
import RankingNewestEvaluations from "~/components/dashboard/ranking-newest-evaluations"
import RankingPriorizacion from "~/components/dashboard/ranking-priorizacion"

export default function DashboardView() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary">Dashboard</h1>



      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
       
        <Card className="col-span-7 bg-white shadow-sm">
          <RankingPriorizacion />
        </Card>
        <Card className="col-span-7 bg-white shadow-sm">
          <RankingNewestEvaluations />
        </Card>
       
      </div>
    </div>
  )
}

