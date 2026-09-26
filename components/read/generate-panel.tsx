"use client"

import { useState } from "react"
import Link from "next/link"
import { Sparkles, Loader2, AlertCircle, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface GeneratePanelProps {
  bookId: string
  sectionId: string
  sectionIdx: number
  sectionTitle: string | null
  totalSections: number
}

const SUGERENCIAS = [
  "Explícame esta parte",
  "Imagínala como escena",
  "¿Qué pasaría si…?",
]

export function GeneratePanel({
  bookId,
  sectionId,
  sectionIdx,
  sectionTitle,
  totalSections,
}: GeneratePanelProps) {
  const [open, setOpen] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)

  const reset = () => {
    setPrompt("")
    setError(null)
    setResult(null)
  }

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) reset()
  }

  const generate = async () => {
    if (!prompt.trim() || generating) return
    setGenerating(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, sectionId, prompt: prompt.trim() }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "Error generando")
      setResult(json.text as string)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido")
    } finally {
      setGenerating(false)
    }
  }

  return (
    <>
      <Button
        size="lg"
        onClick={() => setOpen(true)}
        aria-label="Generar un Momento"
        className="fixed bottom-20 right-4 z-40 h-14 w-14 cursor-pointer rounded-full shadow-lg transition-shadow hover:shadow-xl"
      >
        <Sparkles className="h-6 w-6" />
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Generar un Momento
            </DialogTitle>
            <DialogDescription>
              Sección {sectionIdx + 1} de {totalSections}
              {sectionTitle ? ` — ${sectionTitle}` : ""}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {SUGERENCIAS.map((s) => (
                <Button
                  key={s}
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                  onClick={() => setPrompt(s)}
                  disabled={generating}
                >
                  {s}
                </Button>
              ))}
            </div>

            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              maxLength={2000}
              placeholder="¿Qué se te ocurre? Pide una escena, una explicación, un «¿y si…?»…"
              disabled={generating}
            />

            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {result && (
              <div className="space-y-2 rounded-lg border bg-muted/40 p-4">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {result}
                </p>
                <div className="flex items-center justify-between pt-2">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Check className="h-3 w-3" />
                    Guardado en Momentos
                  </span>
                  <Button variant="link" size="sm" asChild>
                    <Link href={`/book-info/${bookId}/momentos`}>
                      Ver Momentos
                    </Link>
                  </Button>
                </div>
              </div>
            )}

            <Button
              onClick={generate}
              disabled={!prompt.trim() || generating}
              className="w-full cursor-pointer"
            >
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generando…
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generar
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
