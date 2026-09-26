import { getServerClient, missingSupabaseResponse } from "@/lib/supabase/server"
import type { BookRow, SectionRow } from "@/lib/supabase/db-types"

export const dynamic = "force-dynamic"

interface RouteParams {
  params: Promise<{ id: string }>
}

/** GET /api/books/[id] — libro con sus secciones normalizadas en orden. */
export async function GET(_req: Request, { params }: RouteParams) {
  const { id } = await params
  const sb = getServerClient()
  if (!sb) return missingSupabaseResponse()

  const bookRes = await sb.from("books").select("*").eq("id", id).single()
  const book = bookRes.data as BookRow | null
  if (bookRes.error || !book) {
    return Response.json({ error: "Libro no encontrado." }, { status: 404 })
  }

  const secRes = await sb
    .from("sections")
    .select("id,book_id,idx,title,text")
    .eq("book_id", id)
    .order("idx", { ascending: true })
  if (secRes.error) {
    return Response.json(
      { error: `Error leyendo secciones: ${secRes.error.message}` },
      { status: 500 },
    )
  }

  return Response.json({
    book,
    sections: (secRes.data ?? []) as SectionRow[],
  })
}

/** PATCH /api/books/[id] — persiste la posición de lectura (sección). */
export async function PATCH(req: Request, { params }: RouteParams) {
  const { id } = await params
  const sb = getServerClient()
  if (!sb) return missingSupabaseResponse()

  const body = (await req.json().catch(() => null)) as {
    last_section_idx?: unknown
  } | null
  const idx = body?.last_section_idx
  if (!Number.isInteger(idx) || (idx as number) < 0) {
    return Response.json(
      { error: "last_section_idx inválido." },
      { status: 400 },
    )
  }

  const { error } = await sb
    .from("books")
    .update({ last_section_idx: idx as number })
    .eq("id", id)
  if (error) {
    return Response.json(
      { error: `Error guardando posición: ${error.message}` },
      { status: 500 },
    )
  }
  return Response.json({ ok: true })
}
