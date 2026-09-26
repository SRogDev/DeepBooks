"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Save, RotateCcw, AlertCircle, BookOpen, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { DEFAULT_PAUTAS } from "@/lib/pautas"
import { motion } from "framer-motion"

interface BookSummary {
  id: string
  title: string
  author: string | null
}

interface PautaData {
  content: string
  is_default: boolean
}

const EJEMPLOS = [
  "Cada vez que aparezca el mar, genera una visualización cinematográfica.",
  "Hazme una pregunta socrática cuando la tensión entre personajes suba.",
  "Tono: poético, nunca expliques el final.",
]

export function PautasEditor() {
  const [books, setBooks] = useState<BookSummary[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [pautas, setPautas] = useState<PautaData | null>(null)
  const [draft, setDraft] = useState("")
  const [loadingBooks, setLoadingBooks] = useState(true)
  const [loadingPautas, setLoadingPautas] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedAt, setSavedAt] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await fetch("/api/books")
        const json = await res.json()
        if (!res.ok) throw new Error(json.error ?? "Error cargando la biblioteca")
        if (cancelled) return
        const list = (json.books ?? []) as BookSummary[]
        setBooks(list)
        if (list.length > 0) setSelectedId(list[0].id)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Error desconocido")
      } finally {
        if (!cancelled) setLoadingBooks(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!selectedId) return
    let cancelled = false
    const load = async () => {
      setLoadingPautas(true)
      setError(null)
      setSavedAt(null)
      try {
        const res = await fetch(`/api/books/${selectedId}/pautas`)
        const json = await res.json()
        if (!res.ok) throw new Error(json.error ?? "Error cargando las pautas")
        if (cancelled) return
        const p = json.pautas as PautaData
        setPautas(p)
        setDraft(p.content)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Error desconocido")
      } finally {
        if (!cancelled) setLoadingPautas(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [selectedId])

  const dirty = pautas !== null && draft.trim() !== pautas.content

  const save = async () => {
    if (!selectedId || !dirty || saving) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/books/${selectedId}/pautas`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: draft }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "Error guardando las pautas")
      const p = json.pautas as PautaData
      setPautas(p)
      setDraft(p.content)
      setSavedAt(new Date().toLocaleTimeString())
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido")
    } finally {
      setSaving(false)
    }
  }

  const selectedBook = books.find((b) => b.id === selectedId)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-3xl space-y-6 p-4 pb-24"
    >
      <div className="space-y-2 pt-4">
        <h1 className="text-2xl font-bold">Pautas de experiencia</h1>
        <p className="text-sm text-muted-foreground">
          Escribe en lenguaje natural <strong>cómo debe vivirse</strong> cada
          libro: qué generar, cuándo y en qué tono. Estas pautas dirigen cada
          generación de DeepBooks para ese libro.
        </p>
      </div>

      {loadingBooks ? (
        <p className="text-muted-foreground">Cargando tu biblioteca…</p>
      ) : books.length === 0 && !error ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
            <p className="text-muted-foreground">
              Aún no tienes documentos. Agrega uno en la biblioteca para
              escribir sus pautas.
            </p>
            <Button asChild>
              <Link href="/biblioteca">Ir a la biblioteca</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-2">
            <p className="text-sm font-medium">Libro</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {books.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedId(b.id)}
                  className={`cursor-pointer rounded-lg border p-3 text-left transition-colors hover:border-primary ${
                    b.id === selectedId
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                >
                  <p className="truncate text-sm font-medium">{b.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {b.author ?? "Autor desconocido"}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {selectedBook && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                  Pautas para <span className="font-bold">{selectedBook.title}</span>
                </p>
                {pautas && (
                  <Badge variant={pautas.is_default ? "secondary" : "default"}>
                    {pautas.is_default ? "Modo DeepBooks" : "Personalizadas"}
                  </Badge>
                )}
              </div>

              {loadingPautas ? (
                <p className="text-muted-foreground">Cargando pautas…</p>
              ) : (
                <>
                  <Textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    rows={8}
                    maxLength={4000}
                    placeholder="Ej.: Cada vez que aparezca el mar, genera una visualización cinematográfica…"
                    className="resize-y"
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{draft.length} / 4000</span>
                    {savedAt && <span>Guardado a las {savedAt}</span>}
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {error}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <Button onClick={save} disabled={!dirty || saving}>
                      {saving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      Guardar pautas
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setDraft(DEFAULT_PAUTAS)}
                      disabled={draft === DEFAULT_PAUTAS}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Restablecer a Modo DeepBooks
                    </Button>
                  </div>

                  <details className="rounded-lg border p-4 text-sm">
                    <summary className="cursor-pointer font-medium">
                      Ejemplos de pautas
                    </summary>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                      {EJEMPLOS.map((e) => (
                        <li key={e}>{e}</li>
                      ))}
                    </ul>
                  </details>
                </>
              )}
            </div>
          )}
        </>
      )}

    </motion.div>
  )
}
