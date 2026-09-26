/**
 * Identidad de dispositivo para el MVP.
 *
 * DeepBooks MVP no tiene autenticación real: la propiedad de un libro se
 * registra con un id de dispositivo generado localmente y enviado en el
 * header `x-device-id`. Es un peldaño honesto, no seguridad real —
 * post-MVP esto se reemplaza por Supabase Auth (owner_id = auth user).
 */

const KEY = "deepbooks_device_id"

function randomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `dev-${Date.now()}-${Math.floor(Math.random() * 1e9)}`
}

/** Devuelve el id de dispositivo persistido, creándolo si no existe. */
export function getOrCreateDeviceId(): string {
  if (typeof window === "undefined") return ""
  try {
    let id = window.localStorage.getItem(KEY)
    if (!id) {
      id = randomId()
      window.localStorage.setItem(KEY, id)
    }
    return id
  } catch {
    return randomId()
  }
}

/** Normaliza el header x-device-id: null si está vacío o ausente. */
export function resolveDeviceId(headerValue: string | null): string | null {
  const v = headerValue?.trim()
  return v ? v : null
}
