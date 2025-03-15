"use client"

import { Building, ClipboardCheck, FileText, LayoutDashboard, LogOut, Settings, Users } from "lucide-react"
import { Button } from "~/components/ui/button"
import Image from "next/image"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <div className="bg-primary hidden w-64 flex-col text-white md:flex">
      <div className="border-b border-white/10 p-4">
        <div className="flex items-center gap-2">
          <Image
            src="https://plazareal.co.cr/wp-content/uploads/2015/11/Logo-TEC-Color.png"
            alt="TEC Logo"
            width={40}
            height={40}
            className="h-8 w-auto"
          />
          <div>
            <h1 className="text-xl font-bold">Oficina de Ingeniería</h1>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          <li>
            <Button
              variant={activeTab === "dashboard" ? "secondary" : "ghost"}
              className="w-full justify-start text-white hover:bg-white/10 hover:text-white"
              onClick={() => setActiveTab("dashboard")}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </li>
          <li>
            <Button
              variant={activeTab === "edificios" ? "secondary" : "ghost"}
              className="w-full justify-start text-white hover:bg-white/10 hover:text-white"
              onClick={() => setActiveTab("edificios")}
            >
              <Building className="mr-2 h-4 w-4" />
              Edificios
            </Button>
          </li>
          <li>
            <Button
              variant={activeTab === "evaluaciones" ? "secondary" : "ghost"}
              className="w-full justify-start text-white hover:bg-white/10 hover:text-white"
              onClick={() => setActiveTab("evaluaciones")}
            >
              <ClipboardCheck className="mr-2 h-4 w-4" />
              Evaluaciones
            </Button>
          </li>
          <li>
            <Button
              variant={activeTab === "reportes" ? "secondary" : "ghost"}
              className="w-full justify-start text-white hover:bg-white/10 hover:text-white"
              onClick={() => setActiveTab("reportes")}
            >
              <FileText className="mr-2 h-4 w-4" />
              Priorización
            </Button>
          </li>
          <li>
            <Button
              variant={activeTab === "usuarios" ? "secondary" : "ghost"}
              className="w-full justify-start text-white hover:bg-white/10 hover:text-white"
              onClick={() => setActiveTab("usuarios")}
            >
              <Users className="mr-2 h-4 w-4" />
              Usuarios
            </Button>
          </li>
          <li>
            <Button
              variant={activeTab === "parametros" ? "secondary" : "ghost"}
              className="w-full justify-start text-white hover:bg-white/10 hover:text-white"
              onClick={() => setActiveTab("parametros")}
            >
              <Users className="mr-2 h-4 w-4" />
              Parametros
            </Button>
          </li>
          
        </ul>
      </nav>
    </div>
  );
}

