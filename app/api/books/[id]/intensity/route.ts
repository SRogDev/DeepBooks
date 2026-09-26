import { getServerClient, missingSupabaseResponse } from "@/lib/supabase/server"
import { validateIntensityBody } from "@/lib/ambient/validation"

export const dynamic = "force-dynamic"

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * PATCH /api/books/[id]/intensity — cambia la intensidad de los momentos
 * ambientales del libro. Body: { ambient_intensity: 'off' | 'suave' | 'activo' }
 */
export async function PATCH(req: Request, { params }: RouteParams) {
  const { id } = await params
  const body = await req.json().catch(() => null)
  const valid = validateIntensityBody(body)
  if (!valid.ok) {
    return Response.json({ error: valid.error }, { status: 400 })
  }

  const sb = getServerClient()
  if (!sb) return missingSupabaseResponse()

  const { data, error } = await sb
    .from("books")
    .update({ ambient_intensity: valid.value.ambient_intensity })
    .eq("id", id)
    .select("id")
    .single()
  if (error || !data) {
    return Response.json({ error: "Libro no encontrado." }, { status: 404 })
  }
  return Response.json({
    ambient_intensity: valid.value.ambient_intensity,
  })
}
