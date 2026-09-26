import { getServerClient, missingSupabaseResponse } from "@/lib/supabase/server"
import { FEATURE_MARKETPLACE } from "@/lib/flags"
import { resolveDeviceId } from "@/lib/identity"
import {
  acquireListing,
  MarketplaceError,
  type MarketplaceErrorCode,
} from "@/lib/marketplace/service"
import { supabaseMarketplaceStore } from "@/lib/marketplace/store"

export const dynamic = "force-dynamic"

function errorStatus(code: MarketplaceErrorCode): number {
  switch (code) {
    case "book-not-found":
    case "listing-not-found":
      return 404
    case "forbidden":
      return 403
    case "already-listed":
      return 409
  }
}

/**
 * POST /api/marketplace/[id]/acquire — añade el libro a la biblioteca del
 * adquirente. Duplica la fila books (owner = adquirente, source_type
 * 'marketplace') y copia secciones, chunks (con embeddings) y pautas.
 * Los momentos del publicador NO se copian.
 * Header opcional: x-device-id. Responde { bookId }.
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!FEATURE_MARKETPLACE) {
    return Response.json({ error: "El mercado está desactivado." }, { status: 403 })
  }
  const sb = getServerClient()
  if (!sb) return missingSupabaseResponse()

  const { id } = await params
  try {
    const { bookId } = await acquireListing(supabaseMarketplaceStore(sb), {
      listingId: id,
      deviceId: resolveDeviceId(req.headers.get("x-device-id")),
    })
    return Response.json({ bookId }, { status: 201 })
  } catch (e) {
    if (e instanceof MarketplaceError) {
      return Response.json({ error: e.message }, { status: errorStatus(e.code) })
    }
    return Response.json(
      { error: e instanceof Error ? e.message : "Error adquiriendo el libro." },
      { status: 500 },
    )
  }
}
