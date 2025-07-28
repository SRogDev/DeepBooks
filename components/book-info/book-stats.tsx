"use client"

import { Eye, Star, MessageCircle, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Book } from "@/lib/stores/books-store"
import { motion } from "framer-motion"

interface BookStatsProps {
  book: Book
}

export function BookStats({ book }: BookStatsProps) {
  const stats = [
    {
      icon: Eye,
      label: "Lecturas",
      value: book.reads.toLocaleString(),
      color: "text-blue-500",
    },
    {
      icon: Star,
      label: "Calificación",
      value: book.rating.toString(),
      color: "text-yellow-500",
    },
    {
      icon: MessageCircle,
      label: "Reseñas",
      value: book.reviews.toString(),
      color: "text-green-500",
    },
    {
      icon: Users,
      label: "En biblioteca",
      value: "2.1K",
      color: "text-purple-500",
    },
  ]

  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Estadísticas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="text-center space-y-2"
                >
                  <Icon className={`mx-auto h-6 w-6 ${stat.color}`} />
                  <div className="text-lg font-semibold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
