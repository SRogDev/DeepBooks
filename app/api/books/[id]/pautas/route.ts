import { getServerClient, missingSupabaseResponse } from "@/lib/supabase/server"
import { DEFAULT_PAUTAS } from "@/lib/pautas"
import type { PautaRow } from "@/lib/supabase/db-types"

export const dynamic = "force-dynamic"

interface RouteParams {
  params: Promise<{ id: string }>
}

/** Longitud máxima de las pautas (directriz de comportamiento). */
const MAX_PAUTAS_CHARS = 4000

function validateContent(body: unknown): { ok: true; content: string } | { ok: false; error: string } {
  const content = (body as { content?: unknown } | null)?.content
  if (typeof content !== "string" || !content.trim()) {
    return { ok: false, error: "Las pautas no pueden estar vacías." }
  }
  if (content.length > MAX_PAUTAS_CHARS) {
    return {
      ok: false,
      error: `Las pautas no pueden superar ${MAX_PAUTAS_CHARS} caracteres.`,
    }
  }
  return { ok: true, content: content.trim() }
}

/** GET /api/books/[id]/pautas — pautas de experiencia del libro. */
export async function GET(_req: Request, { params }: RouteParams) {
  const { id } = await params
  const sb = getServerClient()
  if (!sb) return missingSupabaseResponse()

  const { data, error } = await sb
    .from("pautas")
    .select("id,book_id,content,is_default")
    .eq("book_id", id)
    .single()
  if (error || !data) {
    return Response.json(
      { error: "Este libro aún no tiene pautas." },
      { status: 404 },
    )
  }
  return Response.json({ pautas: data as PautaRow })
}

/**
 * PATCH /api/books/[id]/pautas — el editor reescribe las pautas.
 * Body: { content }. is_default se recalcula: true solo si el contenido
 * coincide con el "Modo DeepBooks".
 */
export async function PATCH(req: Request, { params }: RouteParams) {
  const { id } = await params
  const body = await req.json().catch(() => null)
  const valid = validateContent(body)
  if (!valid.ok) {
    return Response.json({ error: valid.error }, { status: 400 })
  }

  const sb = getServerClient()
  if (!sb) return missingSupabaseResponse()

  const content = valid.content
  const row = {
    book_id: id,
    content,
    is_default: content === DEFAULT_PAUTAS,
  }
  const { data, error } = await sb
    .from("pautas")
    .upsert(row, { onConflict: "book_id" })
    .select("id,book_id,content,is_default")
    .single()
  if (error || !data) {
    return Response.json(
      { error: `Error guardando pautas: ${error?.message ?? "desconocido"}` },
      { status: 500 },
    )
  }
  return Response.json({ pautas: data as PautaRow })
}
