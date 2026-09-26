import { getServerClient, missingSupabaseResponse } from "@/lib/supabase/server"
import { resolveChatModel, validateGenerateBody } from "@/lib/generate/engine"
import { buildGenerateDeps } from "@/lib/generate/deps"
import { generateOnDemand, NotFoundError } from "@/lib/generate/service"

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

/**
 * POST /api/generate — generación bajo demanda anclada a una posición.
 * Body: { bookId, sectionId?, prompt }
 * Responde { momentoId, text }. El artefacto queda guardado en Momentos.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const valid = validateGenerateBody(body)
  if (!valid.ok) {
    return Response.json({ error: valid.error }, { status: 400 })
  }

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) return missingOpenRouterResponse()
  const sb = getServerClient()
  if (!sb) return missingSupabaseResponse()

  try {
    const result = await generateOnDemand(
      valid.value,
      buildGenerateDeps(sb, apiKey, resolveChatModel()),
    )
    return Response.json(result)
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
