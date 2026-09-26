import { getServerClient, missingSupabaseResponse } from "@/lib/supabase/server"
import { resolveChatModel } from "@/lib/generate/engine"
import { buildGenerateDeps } from "@/lib/generate/deps"
import { generateAmbient, NotFoundError } from "@/lib/generate/service"
import { FEATURE_AMBIENT } from "@/lib/flags"
import {
  AMBIENT_COOLDOWN_MS,
  type AmbientIntensity,
} from "@/lib/ambient/trigger"
import { pickAmbientPrompt } from "@/lib/ambient/prompts"
import { validateAmbientBody } from "@/lib/ambient/validation"

export const dynamic = "force-dynamic"

function missingOpenRouterResponse() {
  return Response.json(
    {
      error:
        "OPENROUTER_API_KEY no está configurada. Define la variable de " +
        "entorno para usar la generación.",
    },
    { status: 503 },
  )
}

interface BookAmbientRow {
  id: string
  ambient_intensity: AmbientIntensity
  last_ambient_at: string | null
}

/**
 * POST /api/ambient — genera un momento ambiental (sorpresa) para un libro.
 * Body: { bookId, sectionId? }
 *
 * Refuerzo server-side (el cliente solo sugiere el momento):
 * - FEATURE_AMBIENT debe estar activo.
 * - El libro debe tener ambient_intensity != 'off'.
 * - Debe haber pasado el cooldown de la intensidad (suave: 20 min,
 *   activo: 8 min) desde el último momento ambiental.
 *
 * Responde { momentoId, text, kind, label }. El artefacto queda guardado
 * en Momentos con origin 'ambient'.
 */
export async function POST(req: Request) {
  if (!FEATURE_AMBIENT) {
    return Response.json(
      { error: "Los momentos ambientales están desactivados." },
      { status: 403 },
    )
  }

  const body = await req.json().catch(() => null)
  const valid = validateAmbientBody(body)
  if (!valid.ok) {
    return Response.json({ error: valid.error }, { status: 400 })
  }

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) return missingOpenRouterResponse()
  const sb = getServerClient()
  if (!sb) return missingSupabaseResponse()

  const { data: book } = await sb
    .from("books")
    .select("id,ambient_intensity,last_ambient_at")
    .eq("id", valid.value.bookId)
    .single()
  const b = book as BookAmbientRow | null
  if (!b) {
    return Response.json({ error: "Libro no encontrado." }, { status: 404 })
  }
  if (b.ambient_intensity === "off") {
    return Response.json(
      { error: "Los momentos ambientales están apagados para este libro." },
      { status: 409 },
    )
  }
  if (b.last_ambient_at) {
    const elapsed = Date.now() - new Date(b.last_ambient_at).getTime()
    if (elapsed < AMBIENT_COOLDOWN_MS[b.ambient_intensity]) {
      return Response.json(
        { error: "Espera un poco antes del próximo momento ambiental." },
        { status: 429 },
      )
    }
  }

  try {
    const item = pickAmbientPrompt()
    const result = await generateAmbient(
      {
        bookId: b.id,
        sectionId: valid.value.sectionId,
        item,
      },
      buildGenerateDeps(sb, apiKey, resolveChatModel()),
    )
    // El cooldown cuenta desde una generación exitosa.
    await sb
      .from("books")
      .update({ last_ambient_at: new Date().toISOString() })
      .eq("id", b.id)
    return Response.json({
      momentoId: result.momentoId,
      text: result.text,
      kind: result.kind,
      label: item.label,
    })
  } catch (e) {
    if (e instanceof NotFoundError) {
      return Response.json({ error: e.message }, { status: 404 })
    }
    if (e instanceof Error && e.message.includes("OpenRouter")) {
      return Response.json({ error: e.message }, { status: 502 })
    }
    return Response.json(
      { error: e instanceof Error ? e.message : "Error generando." },
      { status: 500 },
    )
  }
}
