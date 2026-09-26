/**
 * Lógica pura del trigger de momentos ambientales (Fase 3).
 * Decide CUÁNDO puede aparecer un momento sorpresa, nunca interrumpe
 * la lectura: solo en límites seguros (fin de sección) o pausas de
 * inactividad. El cooldown real se refuerza en el servidor
 * (POST /api/ambient); aquí vive la política, testeable sin I/O.
 */

/** Intensidad configurada por el lector para un libro. */
export type AmbientIntensity = "off" | "suave" | "activo"

/** Cooldown mínimo entre momentos ambientales, por intensidad. */
export const AMBIENT_COOLDOWN_MS: Record<
  Exclude<AmbientIntensity, "off">,
  number
> = {
  suave: 20 * 60_000,
  activo: 8 * 60_000,
}

/** Inactividad (sin scroll ni cambio de sección) que dispara un momento. */
export const AMBIENT_IDLE_MS: Record<Exclude<AmbientIntensity, "off">, number> =
  {
    suave: 120_000,
    activo: 45_000,
  }

export interface TriggerState {
  /** Intensidad configurada en el libro. */
  intensity: AmbientIntensity
  /** "Ahora" en ms (inyectado para tests). */
  nowMs: number
  /** Último momento ambiental en ms, o null si nunca hubo uno. */
  lastAmbientMs: number | null
  /** Ms desde la última actividad de lectura (scroll/cambio de sección). */
  idleMs: number
  /** True si el lector llegó al final de la sección actual. */
  atBoundary: boolean
}

/**
 * ¿Puede aparecer un momento ambiental ahora?
 * - "off" nunca dispara.
 * - Requiere límite seguro (fin de sección) o inactividad suficiente.
 * - Respeta el cooldown de la intensidad.
 */
export function shouldTriggerAmbient(state: TriggerState): boolean {
  if (state.intensity === "off") return false

  const idleEnough = state.idleMs >= AMBIENT_IDLE_MS[state.intensity]
  if (!state.atBoundary && !idleEnough) return false

  if (state.lastAmbientMs !== null) {
    const elapsed = state.nowMs - state.lastAmbientMs
    if (elapsed < AMBIENT_COOLDOWN_MS[state.intensity]) return false
  }

  return true
}
