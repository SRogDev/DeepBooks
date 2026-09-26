import { getServerClient, missingSupabaseResponse } from "@/lib/supabase/server"
import { FEATURE_MARKETPLACE } from "@/lib/flags"
import { resolveDeviceId } from "@/lib/identity"
import {
  unpublishListing,
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
 * DELETE /api/marketplace/[id] — retira una publicación (solo el dueño).
 * Header opcional: x-device-id.
 */
export async function DELETE(
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
    await unpublishListing(supabaseMarketplaceStore(sb), {
      listingId: id,
      deviceId: resolveDeviceId(req.headers.get("x-device-id")),
    })
    return Response.json({ ok: true })
  } catch (e) {
    if (e instanceof MarketplaceError) {
      return Response.json({ error: e.message }, { status: errorStatus(e.code) })
    }
    throw e
  }
}
