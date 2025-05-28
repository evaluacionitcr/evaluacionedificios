import {
  Building,
  ClipboardCheck,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  X,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface SidebarProps {
  activeTab: string;
}

export default function Sidebar({ activeTab }: SidebarProps) {
  return (
    <div className="flex h-full w-64 flex-col bg-primary text-white">
      <div className="flex items-center justify-between border-b border-white/10 p-4">
        <div className="flex items-center gap-2">
          <Image
            src="/tec.png"
            alt="TEC Logo"
            width={80}
            height={80}
            className="h-auto w-auto"
          />
          <div>
            <h1 className="text-xl font-bold">Oficina de Ingeniería</h1>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => {
            // El estado se maneja en el layout
            const event = new CustomEvent("toggleSidebar");
            window.dispatchEvent(event);
          }}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          <li>
            <Link href="/">
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  activeTab === "dashboard"
                    ? "bg-white/10 font-medium text-primary-foreground"
                    : "text-white hover:bg-white/10 hover:text-white"
                }`}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/edificios">
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  activeTab === "edificios"
                    ? "bg-white/10 font-medium text-primary-foreground"
                    : "text-white hover:bg-white/10 hover:text-white"
                }`}
              >
                <Building className="mr-2 h-4 w-4" />
                Edificios
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/evaluaciones">
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  activeTab === "evaluaciones"
                    ? "bg-white/10 font-medium text-primary-foreground"
                    : "text-white hover:bg-white/10 hover:text-white"
                }`}
              >
                <ClipboardCheck className="mr-2 h-4 w-4" />
                Evaluaciones
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/priorizacion">
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  activeTab === "priorizacion"
                    ? "bg-white/10 font-medium text-primary-foreground"
                    : "text-white hover:bg-white/10 hover:text-white"
                }`}
              >
                <FileText className="mr-2 h-4 w-4" />
                Priorización
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/admin/usuarios">
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  activeTab === "usuarios"
                    ? "bg-white/10 font-medium text-primary-foreground"
                    : "text-white hover:bg-white/10 hover:text-white"
                }`}
              >
                <Users className="mr-2 h-4 w-4" />
                Usuarios
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/admin/parametros">
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  activeTab === "parametros"
                    ? "bg-white/10 font-medium text-primary-foreground"
                    : "text-white hover:bg-white/10 hover:text-white"
                }`}
              >
                <Settings className="mr-2 h-4 w-4" />
                Parametros
              </Button>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
