"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { BookOpen, Sparkles } from "lucide-react"
import { GoalsModal } from "@/components/onboarding/goals-modal"
import { useGoalsStore } from "@/lib/stores/goals-store"

export function HeroSection() {
  const [showGoalsModal, setShowGoalsModal] = useState(false)
  const { hasSetGoals } = useGoalsStore()

  const handleExploreClick = () => {
    if (!hasSetGoals) {
      setShowGoalsModal(true)
    } else {
      window.location.href = "/home"
    }
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-primary/20 via-background to-primary/10">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1200')] opacity-5" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 mx-auto max-w-4xl px-4 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-8 inline-flex items-center space-x-2 rounded-full bg-primary/10 px-4 py-2"
        >
          <BookOpen className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium text-primary">DeepBooks</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl"
        >
          Explora tu{" "}
          <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Imaginación</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8 text-lg text-muted-foreground sm:text-xl"
        >
          Sumérgete en mundos infinitos de historias. Lee, crea y comparte experiencias literarias únicas.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
          <Button onClick={handleExploreClick} size="lg" className="group">
            <Sparkles className="mr-2 h-5 w-5 transition-transform group-hover:rotate-12" />
            Explore your Imagination
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 grid grid-cols-3 gap-8 text-center"
        >
          <div>
            <div className="text-2xl font-bold text-primary">10K+</div>
            <div className="text-sm text-muted-foreground">Libros</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">50K+</div>
            <div className="text-sm text-muted-foreground">Lectores</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">1M+</div>
            <div className="text-sm text-muted-foreground">Páginas leídas</div>
          </div>
        </motion.div>
      </motion.div>

      <GoalsModal isOpen={showGoalsModal} onClose={() => setShowGoalsModal(false)} />
    </section>
  )
}
