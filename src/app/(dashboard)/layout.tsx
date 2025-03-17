"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Sidebar from "~/components/layout/sidebar"
import Header from "~/components/layout/header"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState("dashboard")

  // Actualizar la pestaña activa basada en la ruta actual
  useEffect(() => {
    if (pathname === "/") {
      setActiveTab("dashboard")
    } else if (pathname.startsWith("/edificios")) {
      setActiveTab("edificios")
    } else if (pathname.startsWith("/evaluaciones")) {
      setActiveTab("evaluaciones")
    } else if (pathname.startsWith("/reportes")) {
      setActiveTab("reportes")
    } else if (pathname.startsWith("/admin/usuarios")) {
      setActiveTab("usuarios")
    } else if (pathname.startsWith("/admin/parametros")) {
      setActiveTab("parametros")
    }
  }, [pathname])

  return (
    <div className="flex min-h-screen">
      <Sidebar activeTab={activeTab} />
      <div className="flex-1">
        <Header />
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

