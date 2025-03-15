"use client"

import { useState } from "react"
import MainLayout from "~/components/main-layout"
import DashboardView from "~/components/dashboard-view"
import BuildingsView from "~/components/buildings-view"
import EvaluationsView from "~/components/evaluations-view"
import ReportsView from "~/components/reports-view"
import UsersView from "~/components/users-view"

export default function EvaluacionEdificios() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="bg-gray-50 min-h-screen">
      <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        {activeTab === "dashboard" && <DashboardView />}
        {activeTab === "edificios" && <BuildingsView />}
        {activeTab === "evaluaciones" && <EvaluationsView />}
        {activeTab === "reportes" && <ReportsView />}
        {activeTab === "usuarios" && <UsersView />}
        {activeTab === "parametros" && <div>Parametros</div>}
      </MainLayout>
    </div>
  )
}

