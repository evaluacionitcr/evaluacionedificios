import type { ReactNode } from "react"
import Sidebar from "./sidebar"
import Header from "./header"

interface MainLayoutProps {
  children: ReactNode
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function MainLayout({ children, activeTab, setActiveTab }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1">
        <Header />
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

