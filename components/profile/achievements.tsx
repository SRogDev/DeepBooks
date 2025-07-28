"use client"

import { Trophy, Award, Star, Target } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function Achievements() {
  const achievements = [
    {
      icon: Trophy,
      title: "Lector Voraz",
      description: "Lee 50 libros",
      completed: true,
    },
    {
      icon: Award,
      title: "Crítico Experto",
      description: "Escribe 100 reseñas",
      completed: false,
    },
    {
      icon: Star,
      title: "Favorito de la Comunidad",
      description: "Recibe 1000 likes",
      completed: true,
    },
    {
      icon: Target,
      title: "Meta Anual",
      description: "Completa tu meta de lectura",
      completed: false,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Logros</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {achievements.map((achievement) => {
            const Icon = achievement.icon
            return (
              <div
                key={achievement.title}
                className={`rounded-lg border p-3 ${
                  achievement.completed ? "border-primary/20 bg-primary/5" : "border-muted"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon className={`h-5 w-5 ${achievement.completed ? "text-primary" : "text-muted-foreground"}`} />
                  {achievement.completed && (
                    <Badge variant="secondary" className="text-xs">
                      Completado
                    </Badge>
                  )}
                </div>
                <h3 className="mt-2 font-medium">{achievement.title}</h3>
                <p className="text-xs text-muted-foreground">{achievement.description}</p>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
