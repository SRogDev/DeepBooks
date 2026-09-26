"use client"

/**
 * Hook del trigger de momentos ambientales en el lector (Fase 3).
 * Nunca interrumpe: solo sugiere un momento al llegar al final de una
 * sección (límite seguro) o tras inactividad de lectura. El servidor
 * (/api/ambient) aplica el cooldown real y puede responder 429/409 sin
 * que la UI muestre nada: el silencio es el comportamiento correcto.
 */
import { useCallback, useEffect, useRef, useState } from "react"
import type { RefObject } from "react"
import { FEATURE_AMBIENT } from "@/lib/flags"
import {
  shouldTriggerAmbient,
  AMBIENT_IDLE_MS,
  type AmbientIntensity,
} from "./trigger"

export interface AmbientMoment {
  id: string
  text: string
  kind: string
  label: string
}

interface UseAmbientTriggerOpts {
  bookId: string
  sectionId: string
  /** Cambia al navegar: reinicia la inactividad. */
  sectionIdx: number
  intensity: AmbientIntensity
  scrollContainerRef: RefObject<HTMLElement | null>
}

/** Qué tan cerca del final (px) cuenta como "fin de sección". */
const BOUNDARY_PX = 160
/** Con qué frecuencia se revisa la inactividad. */
const IDLE_CHECK_MS = 5000

export function useAmbientTrigger({
  bookId,
  sectionId,
  sectionIdx,
  intensity,
  scrollContainerRef,
}: UseAmbientTriggerOpts) {
  const [moment, setMoment] = useState<AmbientMoment | null>(null)
  // Si el lector descarta el momento, no se reintenta en esta sesión.
  const dismissedRef = useRef(false)
  const inflightRef = useRef(false)

  const fire = useCallback(
    async (atBoundary: boolean, idleMs: number) => {
      if (
        !FEATURE_AMBIENT ||
        intensity === "off" ||
        dismissedRef.current ||
        inflightRef.current ||
        moment
      ) {
        return
      }
      if (
        !shouldTriggerAmbient({
          intensity,
          nowMs: Date.now(),
          lastAmbientMs: null, // el servidor aplica el cooldown real
          idleMs,
          atBoundary,
        })
      ) {
        return
      }
      inflightRef.current = true
      try {
        const res = await fetch("/api/ambient", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookId, sectionId }),
        })
        // 403/409/429/503 → silencio: no hay momento que mostrar.
        if (!res.ok) return
        const json = await res.json()
        if (dismissedRef.current) return
        setMoment({
          id: json.momentoId as string,
          text: json.text as string,
          kind: json.kind as string,
          label: json.label as string,
        })
      } catch {
        // Red caída, etc.: la lectura sigue sin interrupciones.
      } finally {
        inflightRef.current = false
      }
    },
    [bookId, sectionId, intensity, moment],
  )

  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el || !FEATURE_AMBIENT || intensity === "off") return

    let lastActivity = Date.now()
    let idleFired = false

    const isScrollable = () =>
      el.scrollHeight > el.clientHeight + BOUNDARY_PX

    const onScroll = () => {
      lastActivity = Date.now()
      idleFired = false
      if (!isScrollable()) return
      const nearBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight < BOUNDARY_PX
      if (nearBottom) void fire(true, 0)
    }

    const timer = setInterval(() => {
      const idleMs = Date.now() - lastActivity
      if (!idleFired && idleMs >= AMBIENT_IDLE_MS[intensity]) {
        idleFired = true
        void fire(false, idleMs)
      }
    }, IDLE_CHECK_MS)

    el.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      el.removeEventListener("scroll", onScroll)
      clearInterval(timer)
    }
  }, [bookId, sectionId, sectionIdx, intensity, fire, scrollContainerRef])

  const dismiss = useCallback(() => {
    dismissedRef.current = true
    setMoment(null)
  }, [])

  return { moment, dismiss }
}
