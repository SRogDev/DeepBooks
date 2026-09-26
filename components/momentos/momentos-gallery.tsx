"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Sparkles, AlertCircle, ArrowLeft, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { motion } from "framer-motion"

interface Momento {
  id: string
  kind: string
  prompt: string | null
  output_text: string | null
  output_ref: string | null
  origin: "on_demand" | "ambient"
  anchor_title: string | null
  anchor_idx: number | null
  created_at: string
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

const ORIGIN_LABEL: Record<Momento["origin"], string> = {
  on_demand: "Bajo demanda",
  ambient: "Ambiental",
}

export function MomentosGallery({ bookId }: { bookId: string }) {
  const [momentos, setMomentos] = useState<Momento[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await fetch(`/api/books/${bookId}/momentos`)
        const json = await res.json()
        if (!res.ok) throw new Error(json.error ?? "Error cargando Momentos")
        if (!cancelled) setMomentos(json.momentos ?? [])
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Error desconocido")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [bookId])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-3xl space-y-6 p-4 pb-24"
    >
      <div className="space-y-2 pt-4">
        <Button variant="ghost" size="sm" asChild className="cursor-pointer">
          <Link href={`/book-info/${bookId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al libro
          </Link>
        </Button>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Sparkles className="h-6 w-6" />
          Momentos
        </h1>
        <p className="text-sm text-muted-foreground">
          Todo lo que la IA generó para este libro: tus peticiones y los
          momentos que surgieron solos.
        </p>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Cargando Momentos…</p>
      ) : error ? (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      ) : momentos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
            <Sparkles className="h-8 w-8 text-muted-foreground" />
            <p className="font-medium">Aún no hay Momentos</p>
            <p className="text-sm text-muted-foreground">
              Genera tu primer Momento desde el lector con el botón flotante
              de generar.
            </p>
            <Button asChild>
              <Link href={`/read/${bookId}`}>
                <BookOpen className="mr-2 h-4 w-4" />
                Volver a leer
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {momentos.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.05, 0.3) }}
            >
              <Card>
                <CardHeader className="space-y-2 pb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{ORIGIN_LABEL[m.origin]}</Badge>
                    {m.anchor_idx !== null && (
                      <span className="text-xs text-muted-foreground">
                        Sección {m.anchor_idx + 1}
                        {m.anchor_title ? ` — ${m.anchor_title}` : ""}
                      </span>
                    )}
                    <span className="ml-auto text-xs text-muted-foreground">
                      {formatDate(m.created_at)}
                    </span>
                  </div>
                  {m.prompt && (
                    <p className="text-sm italic text-muted-foreground">
                      «{m.prompt}»
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  {m.output_text ? (
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {m.output_text}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Este Momento no tiene texto para mostrar.
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
