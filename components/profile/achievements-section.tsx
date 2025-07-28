"use client"

import { Trophy } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useGoalsStore } from "@/lib/stores/goals-store"
import { motion, AnimatePresence } from "framer-motion"

export function AchievementsSection() {
  const { achievements, markAchievementAsViewed } = useGoalsStore()

  const handleAchievementClick = (achievementId: string) => {
    markAchievementAsViewed(achievementId)
  }

  if (achievements.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Logros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aún no tienes logros desbloqueados</p>
            <p className="text-sm">¡Sigue leyendo y escribiendo para desbloquear logros!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="h-5 w-5" />
          <span>Logros Desbloqueados</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence>
          <div className="space-y-3">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleAchievementClick(achievement.id)}
                className="cursor-pointer"
              >
                <div
                  className={`rounded-lg border p-3 transition-all hover:shadow-md ${
                    achievement.type === "reading"
                      ? "border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-900/20"
                      : "border-purple-200 bg-purple-50/50 dark:border-purple-800 dark:bg-purple-900/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          achievement.type === "reading"
                            ? "bg-blue-100 dark:bg-blue-900"
                            : "bg-purple-100 dark:bg-purple-900"
                        }`}
                      >
                        <span className="text-lg">{achievement.icon}</span>
                      </div>
                      <div>
                        <h3 className="font-medium flex items-center space-x-2">
                          <span>{achievement.title}</span>
                          {achievement.isNew && (
                            <Badge variant="secondary" className="text-xs bg-red-100 text-red-700">
                              Nuevo
                            </Badge>
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        <p className="text-xs text-muted-foreground">
                          Desbloqueado el {achievement.unlockedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={
                        achievement.type === "reading"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                          : "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                      }
                    >
                      {achievement.type === "reading" ? "📖 Lectura" : "✍️ Escritura"}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
