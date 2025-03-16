"use client"

import { useState } from "react"
import MainLayout from "~/components/layout/main-layout"
import DashboardView from "~/components/views/dashboard-view"
import BuildingsView from "~/components/views/buildings-view"
import EvaluationsView from "~/components/views/evaluations-view"
import ReportsView from "~/components/views/reports-view"
import UsersView from "~/components/views/users-view"
import ParametersView from "~/components/views/parameters-view"

export default function EvaluacionEdificios() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="bg-gray-50 min-h-screen">
      <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        {activeTab === "dashboard" && <DashboardView />}
      </MainLayout>
    </div>
  )
}

