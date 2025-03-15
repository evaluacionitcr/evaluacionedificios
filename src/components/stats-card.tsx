import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"

interface StatsCardProps {
  title: string
  value: string
  description?: string
  icon: ReactNode
}

export default function StatsCard({ title, value, description, icon }: StatsCardProps) {
  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-primary">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  )
}

