import { getServerClient, missingSupabaseResponse } from "@/lib/supabase/server"
import type { MomentoRow, SectionRow } from "@/lib/supabase/db-types"

export const dynamic = "force-dynamic"

interface RouteParams {
  params: Promise<{ id: string }>
}

export interface MomentoWithAnchor extends MomentoRow {
  anchor_title: string | null
  anchor_idx: number | null
}

/**
 * GET /api/books/[id]/momentos — galería de Momentos del libro,
 * más recientes primero, con el título de la sección ancla.
 */
export async function GET(_req: Request, { params }: RouteParams) {
  const { id } = await params
  const sb = getServerClient()
  if (!sb) return missingSupabaseResponse()

  const { data, error } = await sb
    .from("momentos")
    .select(
      "id,book_id,user_id,kind,prompt,output_ref,output_text,anchor_section_id,origin,created_at",
    )
    .eq("book_id", id)
    .order("created_at", { ascending: false })
  if (error) {
    return Response.json(
      { error: `Error listando Momentos: ${error.message}` },
      { status: 500 },
    )
  }
  const rows = (data ?? []) as MomentoRow[]

  const anchorIds = [...new Set(rows.map((r) => r.anchor_section_id).filter(Boolean))] as string[]
  let anchors = new Map<string, SectionRow>()
  if (anchorIds.length > 0) {
    const { data: secs } = await sb
      .from("sections")
      .select("id,book_id,idx,title,text")
      .in("id", anchorIds)
    anchors = new Map(((secs ?? []) as SectionRow[]).map((s) => [s.id, s]))
  }

  const momentos: MomentoWithAnchor[] = rows.map((r) => {
    const a = r.anchor_section_id ? anchors.get(r.anchor_section_id) : undefined
    return {
      ...r,
      anchor_title: a?.title ?? null,
      anchor_idx: a?.idx ?? null,
    }
  })
  return Response.json({ momentos })
}
