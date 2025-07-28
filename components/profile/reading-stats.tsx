"use client"

import { BookOpen, Clock, Flame } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUserStore } from "@/lib/stores/user-store"

export function ReadingStats() {
  const { user } = useUserStore()

  if (!user) return null

  const stats = [
    {
      icon: BookOpen,
      label: "Libros Leídos",
      value: user.stats.booksRead,
      color: "text-blue-500",
    },
    {
      icon: Flame,
      label: "Racha de Lectura",
      value: `${user.stats.readingStreak} días`,
      color: "text-orange-500",
    },
    {
      icon: Clock,
      label: "Tiempo Total",
      value: `${Math.floor(user.stats.totalReadingTime / 60)}h`,
      color: "text-green-500",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estadísticas de Lectura</CardTitle>
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
