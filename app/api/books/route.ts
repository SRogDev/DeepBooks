import { getServerClient, missingSupabaseResponse } from "@/lib/supabase/server"
import type { BookRow } from "@/lib/supabase/db-types"

export const dynamic = "force-dynamic"

/** GET /api/books — lista de libros (id, título, autor, portada, fecha). */
export async function GET() {
  const sb = getServerClient()
  if (!sb) return missingSupabaseResponse()

  const { data, error } = await sb
    .from("books")
    .select("id,title,author,cover_url,source_type,created_at")
    .order("created_at", { ascending: false })

  if (error) {
    return Response.json(
      { error: `Error listando libros: ${error.message}` },
      { status: 500 },
    )
  }
  return Response.json({ books: (data ?? []) as Partial<BookRow>[] })
}
