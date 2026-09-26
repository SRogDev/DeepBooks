"use client"

import { useState } from "react"
import { Sparkles } from "lucide-react"
import { FEATURE_AMBIENT } from "@/lib/flags"
import type { AmbientIntensity } from "@/lib/ambient/trigger"
import { cn } from "@/lib/utils"

interface AmbientIntensityControlProps {
  bookId: string
  initial: AmbientIntensity
}

const OPTIONS: {
  value: AmbientIntensity
  label: string
  hint: string
}[] = [
  {
    value: "off",
    label: "Apagados",
    hint: "Nunca aparecen momentos sorpresa mientras lees.",
  },
  {
    value: "suave",
    label: "Suaves",
    hint: "Sorpresas ocasionales: al terminar una sección o tras 2 min de pausa. Como mucho una cada 20 min.",
  },
  {
    value: "activo",
    label: "Activos",
    hint: "Sorpresas frecuentes: al terminar una sección o tras 45 s de pausa. Como mucho una cada 8 min.",
  },
]

/**
 * Selector de intensidad de momentos ambientales en el hub del libro.
 * Persiste con PATCH /api/books/[id]/intensity.
 */
export function AmbientIntensityControl({
  bookId,
  initial,
}: AmbientIntensityControlProps) {
  const [intensity, setIntensity] = useState<AmbientIntensity>(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!FEATURE_AMBIENT) return null

  const selected = OPTIONS.find((o) => o.value === intensity) ?? OPTIONS[0]

  const change = async (next: AmbientIntensity) => {
    if (next === intensity || saving) return
    const prev = intensity
    setIntensity(next)
    setError(null)
    setSaving(true)
    try {
      const res = await fetch(`/api/books/${bookId}/intensity`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ambient_intensity: next }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.error ?? "No se pudo guardar.")
    } catch (e) {
      setIntensity(prev)
      setError(e instanceof Error ? e.message : "No se pudo guardar.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-xl border bg-card p-4">
      <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold">
        <Sparkles className="h-4 w-4 text-primary" />
        Momentos ambientales
      </p>
      <div
        className="grid grid-cols-3 gap-1 rounded-lg bg-muted p-1"
        role="radiogroup"
        aria-label="Intensidad de momentos ambientales"
      >
        {OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={intensity === o.value}
            disabled={saving}
            onClick={() => change(o.value)}
            className={cn(
              "rounded-md px-2 py-1.5 text-sm font-medium transition-colors",
              "disabled:cursor-wait disabled:opacity-60",
              intensity === o.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {selected.hint}
      </p>
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  )
}
