"use client"

import { useEffect } from "react"
import { Trophy, BookOpen, Users, Search, Gift } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useAchievementsStore, type DailyAchievement } from "@/lib/stores/achievements-store"
import { motion } from "framer-motion"

interface DailyAchievementsModalProps {
  isOpen: boolean
  onClose: () => void
}

const achievementIcons = {
  reading: BookOpen,
  community: Users,
  discovery: Search,
}

const mockDailyAchievements: DailyAchievement[] = [
  {
    id: "daily-read",
    title: "Lector Diario",
    description: "Lee 50 páginas hoy",
    icon: "📖",
    pagesReward: 25,
    progress: 32,
    target: 50,
    completed: false,
    type: "reading",
  },
  {
    id: "community-engage",
    title: "Participación Activa",
    description: "Da 10 likes en la comunidad",
    icon: "❤️",
    pagesReward: 15,
    progress: 7,
    target: 10,
    completed: false,
    type: "community",
  },
  {
    id: "discover-books",
    title: "Explorador",
    description: "Descubre 3 libros nuevos",
    icon: "🔍",
    pagesReward: 20,
    progress: 3,
    target: 3,
    completed: true,
    type: "discovery",
  },
  {
    id: "reading-streak",
    title: "Racha de Lectura",
    description: "Mantén tu racha por 7 días",
    icon: "🔥",
    pagesReward: 50,
    progress: 5,
    target: 7,
    completed: false,
    type: "reading",
  },
  {
    id: "share-quote",
    title: "Inspirador",
    description: "Comparte 2 citas en la comunidad",
    icon: "💭",
    pagesReward: 30,
    progress: 1,
    target: 2,
    completed: false,
    type: "community",
  },
]

export function DailyAchievementsModal({ isOpen, onClose }: DailyAchievementsModalProps) {
  const { dailyAchievements, setDailyAchievements } = useAchievementsStore()

  useEffect(() => {
    setDailyAchievements(mockDailyAchievements)
  }, [setDailyAchievements])

  const totalPossiblePages = dailyAchievements.reduce((sum, achievement) => sum + achievement.pagesReward, 0)
  const earnedPages = dailyAchievements
    .filter((achievement) => achievement.completed)
    .reduce((sum, achievement) => sum + achievement.pagesReward, 0)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span>Logros Diarios</span>
          </DialogTitle>
          <DialogDescription>Completa estos desafíos para ganar páginas extra de lectura</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Resumen de páginas */}
          <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Páginas Disponibles Hoy</h3>
                  <p className="text-sm text-muted-foreground">
                    {earnedPages} de {totalPossiblePages} páginas ganadas
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Gift className="h-8 w-8 text-primary" />
                  <span className="text-2xl font-bold text-primary">{earnedPages}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de logros */}
          <div className="space-y-3">
            {dailyAchievements.map((achievement, index) => {
              const Icon = achievementIcons[achievement.type]
              const progressPercentage = (achievement.progress / achievement.target) * 100

              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={achievement.completed ? "border-green-200 bg-green-50/50" : ""}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full ${
                              achievement.completed ? "bg-green-100" : "bg-primary/10"
                            }`}
                          >
                            <span className="text-lg">{achievement.icon}</span>
                          </div>
                        </div>

                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{achievement.title}</h4>
                            <Badge variant={achievement.completed ? "default" : "secondary"} className="text-xs">
                              +{achievement.pagesReward} páginas
                            </Badge>
                          </div>

                          <p className="text-sm text-muted-foreground">{achievement.description}</p>

                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span>
                                {achievement.progress} / {achievement.target}
                              </span>
                              <span>{Math.round(progressPercentage)}%</span>
                            </div>
                            <Progress value={progressPercentage} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
