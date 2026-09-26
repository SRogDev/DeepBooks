"use client"

import Link from "next/link"
import { Sparkles, X } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface AmbientMomentCardProps {
  bookId: string
  text: string
  label: string
  onDismiss: () => void
}

/**
 * Tarjeta no bloqueante con un momento ambiental recién generado.
 * Aparece sobre la lectura sin interrumpirla; el lector la descarta
 * o salta a verla en Momentos.
 */
export function AmbientMomentCard({
  bookId,
  text,
  label,
  onDismiss,
}: AmbientMomentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, x: "-50%" }}
      animate={{ opacity: 1, y: 0, x: "-50%" }}
      exit={{ opacity: 0, y: 24, x: "-50%" }}
      transition={{ duration: 0.3 }}
      className="absolute bottom-20 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md rounded-xl border bg-card p-4 shadow-2xl"
      role="dialog"
      aria-label="Momento ambiental"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className="flex items-center gap-1.5 text-sm font-semibold">
          <Sparkles className="h-4 w-4 text-primary" />
          Momento ambiental ✦
          <span className="font-normal text-muted-foreground">· {label}</span>
        </p>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0"
          onClick={onDismiss}
          aria-label="Descartar momento"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <p className="mb-4 text-sm leading-relaxed text-muted-foreground line-clamp-6">
        {text}
      </p>
      <div className="flex gap-2">
        <Button size="sm" asChild className="flex-1">
          <Link href={`/book-info/${bookId}/momentos`}>Ver en Momentos</Link>
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onDismiss}
          className="flex-1"
        >
          Descartar
        </Button>
      </div>
    </motion.div>
  )
}
