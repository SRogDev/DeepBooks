/**
 * Validación de cuerpos en el borde para las rutas ambientales (Fase 3).
 * Pura y testeable sin I/O.
 */
import type { AmbientIntensity } from "./trigger"

export const AMBIENT_INTENSITIES: readonly AmbientIntensity[] = [
  "off",
  "suave",
  "activo",
]

export interface AmbientBody {
  bookId: string
  sectionId?: string
}

type AmbientResult =
  | { ok: true; value: AmbientBody }
  | { ok: false; error: string }

/** Valida el cuerpo de POST /api/ambient. */
export function validateAmbientBody(body: unknown): AmbientResult {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Cuerpo inválido." }
  }
  const b = body as Record<string, unknown>
  if (typeof b.bookId !== "string" || !b.bookId.trim()) {
    return { ok: false, error: "bookId es obligatorio." }
  }
  if (b.sectionId !== undefined && typeof b.sectionId !== "string") {
    return { ok: false, error: "sectionId inválido." }
  }
  return {
    ok: true,
    value: {
      bookId: b.bookId.trim(),
      sectionId: b.sectionId?.trim() || undefined,
    },
  }
}

export interface IntensityBody {
  ambient_intensity: AmbientIntensity
}

type IntensityResult =
  | { ok: true; value: IntensityBody }
  | { ok: false; error: string }

/** Valida el cuerpo de PATCH /api/books/[id]/intensity. */
export function validateIntensityBody(body: unknown): IntensityResult {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Cuerpo inválido." }
  }
  const b = body as Record<string, unknown>
  if (
    typeof b.ambient_intensity !== "string" ||
    !(AMBIENT_INTENSITIES as readonly string[]).includes(b.ambient_intensity)
  ) {
    return {
      ok: false,
      error: "ambient_intensity debe ser 'off', 'suave' o 'activo'.",
    }
  }
  return {
    ok: true,
    value: { ambient_intensity: b.ambient_intensity as AmbientIntensity },
  }
}
