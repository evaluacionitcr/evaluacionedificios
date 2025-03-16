import { Building, ClipboardCheck, FileText, LayoutDashboard, LogOut, Settings, Users } from "lucide-react"
import { Button } from "~/components/ui/button"
import Image from "next/image"
import Link from "next/link"

interface SidebarProps {
  activeTab: string
}

export default function Sidebar({ activeTab }: SidebarProps) {
  return (
    <div className="hidden w-64 flex-col bg-primary text-white md:flex">
      <div className="border-b border-white/10 p-4">
        <div className="flex items-center gap-2">
          <Image
            src="https://plazareal.co.cr/logo-tec-color/"
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
            <Link href="/">
              <Button
                variant={activeTab === "dashboard" ? "secondary" : "ghost"}
                className="w-full justify-start text-white hover:bg-white/10 hover:text-white"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/edificios">
              <Button
                variant={activeTab === "edificios" ? "secondary" : "ghost"}
                className="w-full justify-start text-white hover:bg-white/10 hover:text-white"
              >
                <Building className="mr-2 h-4 w-4" />
                Edificios
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/evaluaciones">
              <Button
                variant={activeTab === "evaluaciones" ? "secondary" : "ghost"}
                className="w-full justify-start text-white hover:bg-white/10 hover:text-white"
              >
                <ClipboardCheck className="mr-2 h-4 w-4" />
                Evaluaciones
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/reportes">
              <Button
                variant={activeTab === "reportes" ? "secondary" : "ghost"}
                className="w-full justify-start text-white hover:bg-white/10 hover:text-white"
              >
                <FileText className="mr-2 h-4 w-4" />
                Priorización
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/usuarios">
              <Button
                variant={activeTab === "usuarios" ? "secondary" : "ghost"}
                className="w-full justify-start text-white hover:bg-white/10 hover:text-white"
              >
                <Users className="mr-2 h-4 w-4" />
                Usuarios
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/parametros">
              <Button
                variant={activeTab === "parametros" ? "secondary" : "ghost"}
                className="w-full justify-start text-white hover:bg-white/10 hover:text-white"
              >
                <Users className="mr-2 h-4 w-4" />
                Parametros
              </Button>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

