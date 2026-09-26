"use client"

import Link from "next/link"
import { Plus, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BenefitsCard } from "./benefits-card"
import { motion } from "framer-motion"

/**
 * Panel de gestión del escritor (Fase 2).
 * Estado honesto: sin datos de ventas reales aún (llegan con el mercado,
 * Fase 4). El alta de documentos vive en /biblioteca.
 */
export function WriterDashboard() {
  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Panel de Gestión</h1>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Mis Libros</h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-3 rounded-lg border p-8 text-center"
        >
          <BookOpen className="h-8 w-8 text-muted-foreground" />
          <p className="text-muted-foreground">
            Aún no tienes libros en gestión. Agrega un documento en la
            biblioteca y escribe sus pautas de experiencia.
          </p>
          <Button asChild>
            <Link href="/biblioteca">Ir a la biblioteca</Link>
          </Button>
        </motion.div>
      </div>

      <BenefitsCard />

      <div className="fixed bottom-20 right-4 z-40">
        <Button
          size="lg"
          asChild
          aria-label="Agregar documento"
          className="h-14 w-14 cursor-pointer rounded-full shadow-lg transition-shadow hover:shadow-xl"
        >
          <Link href="/biblioteca">
            <Plus className="h-6 w-6" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
