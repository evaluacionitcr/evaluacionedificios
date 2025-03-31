"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "~/components/layout/sidebar";
import Header from "~/components/layout/header";
import { Menu } from "lucide-react";
import { Button } from "~/components/ui/button";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Actualizar la pestaña activa basada en la ruta actual
  useEffect(() => {
    if (pathname === "/") {
      setActiveTab("dashboard");
    } else if (pathname.startsWith("/edificios")) {
      setActiveTab("edificios");
    } else if (pathname.startsWith("/evaluaciones")) {
      setActiveTab("evaluaciones");
    } else if (pathname.startsWith("/reportes")) {
      setActiveTab("reportes");
    } else if (pathname.startsWith("/admin/usuarios")) {
      setActiveTab("usuarios");
    } else if (pathname.startsWith("/admin/parametros")) {
      setActiveTab("parametros");
    }
  }, [pathname]);

  // Asegurar que el sidebar esté abierto en pantallas mayores a md
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      }
    };

    // Establecer al cargar
    handleResize();

    // Añadir listener para cambios de tamaño
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Modificar el comportamiento del evento toggleSidebar
  useEffect(() => {
    const handleToggleSidebar = () => {
      // Solo cerrar en móvil
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("toggleSidebar", handleToggleSidebar);

    return () => {
      window.removeEventListener("toggleSidebar", handleToggleSidebar);
    };
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Overlay para móvil */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar con ancho fijo explícito */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ minWidth: "16rem", width: "16rem" }} // Forzar el ancho
      >
        <Sidebar activeTab={activeTab} />
      </div>

      {/* Contenido principal */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </Header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
