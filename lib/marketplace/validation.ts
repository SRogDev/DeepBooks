/**
 * Validación de cuerpos para el mercado (pura, sin I/O).
 *
 * Nota de honestidad sobre precio: el MVP no tiene pagos reales. El mercado
 * es intercambio gratuito; `priceCents` se guarda como "precio sugerido"
 * aspiracional y la UI lo muestra con la nota explícita de que adquirir es
 * gratis. No existe checkout.
 */

export interface PublishInput {
  bookId: string
  description: string | null
  priceCents: number
}

export type ValidationResult =
  | { ok: true; value: PublishInput }
  | { ok: false; error: string }

const MAX_DESCRIPTION = 500

export function validatePublishBody(body: unknown): ValidationResult {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "El cuerpo debe ser un objeto JSON." }
  }
  const b = body as Record<string, unknown>

  const rawId = b.bookId
  if (typeof rawId !== "string" || !rawId.trim()) {
    return { ok: false, error: "bookId es obligatorio." }
  }

  let description: string | null = null
  if (b.description !== undefined && b.description !== null) {
    if (typeof b.description !== "string") {
      return { ok: false, error: "description debe ser texto." }
    }
    description = b.description.trim() || null
    if (description && description.length > MAX_DESCRIPTION) {
      return {
        ok: false,
        error: `description supera los ${MAX_DESCRIPTION} caracteres.`,
      }
    }
  }

  let priceCents = 0
  if (b.priceCents !== undefined && b.priceCents !== null) {
    if (
      typeof b.priceCents !== "number" ||
      !Number.isInteger(b.priceCents) ||
      b.priceCents < 0
    ) {
      return {
        ok: false,
        error: "priceCents debe ser un entero no negativo (centavos).",
      }
    }
    priceCents = b.priceCents
  }

  return { ok: true, value: { bookId: rawId.trim(), description, priceCents } }
}
