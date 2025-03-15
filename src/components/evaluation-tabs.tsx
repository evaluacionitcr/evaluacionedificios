import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import PendingEvaluations from "./pending-evaluations"
import CompletedEvaluations from "./completed-evaluations"

export default function EvaluationTabs() {
  return (
    <Tabs defaultValue="pendientes">
      <TabsList>
        <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
        <TabsTrigger value="completadas">Completadas</TabsTrigger>
        <TabsTrigger value="todas">Todas</TabsTrigger>
      </TabsList>
      <TabsContent value="pendientes" className="space-y-4">
        <PendingEvaluations />
      </TabsContent>

      <TabsContent value="completadas" className="space-y-4">
        <CompletedEvaluations />
      </TabsContent>

      <TabsContent value="todas">
        <p className="text-muted-foreground">Mostrando todas las evaluaciones...</p>
      </TabsContent>
    </Tabs>
  )
}

