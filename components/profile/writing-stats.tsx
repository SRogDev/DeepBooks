"use client"

import { PenTool, Users, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function WritingStats() {
  const stats = [
    {
      icon: PenTool,
      label: "Historias Publicadas",
      value: 12,
      color: "text-purple-500",
    },
    {
      icon: Users,
      label: "Lectores Totales",
      value: "2.5K",
      color: "text-blue-500",
    },
    {
      icon: TrendingUp,
      label: "Engagement",
      value: "85%",
      color: "text-green-500",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estadísticas de Escritura</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="text-center">
                <Icon className={`mx-auto h-8 w-8 ${stat.color}`} />
                <div className="mt-2 text-lg font-semibold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
