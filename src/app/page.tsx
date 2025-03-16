"use client";

import { useState } from "react";
import MainLayout from "~/components/layout/main-layout";
import DashboardView from "~/components/views/dashboard-view";
import BuildingsView from "~/components/views/buildings-view";
import EvaluationsView from "~/components/views/evaluations-view";
import ReportsView from "~/components/views/reports-view";
import UsersView from "~/components/views/users-view";
import ParametersView from "~/components/views/parameters-view";
import { RedirectToSignIn, SignedIn } from "@clerk/nextjs";
import { SignedOut } from "@clerk/nextjs";

export default function EvaluacionEdificios() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <main className="">
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <div className="min-h-screen bg-gray-50">
          <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
            {activeTab === "dashboard" && <DashboardView />}
          </MainLayout>
        </div>
      </SignedIn>
    </main>
  );
}
