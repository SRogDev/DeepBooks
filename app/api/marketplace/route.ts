import { getServerClient, missingSupabaseResponse } from "@/lib/supabase/server"
import { FEATURE_MARKETPLACE } from "@/lib/flags"
import { resolveDeviceId } from "@/lib/identity"
import { validatePublishBody } from "@/lib/marketplace/validation"
import {
  publishListing,
  MarketplaceError,
  type MarketplaceErrorCode,
} from "@/lib/marketplace/service"
import { supabaseMarketplaceStore } from "@/lib/marketplace/store"

export const dynamic = "force-dynamic"

function disabledResponse() {
  return Response.json({ error: "El mercado está desactivado." }, { status: 403 })
}

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
 * GET /api/marketplace — publicaciones recientes con datos del libro.
 * Responde { listings: [{ id, book_id, description, price_cents, created_at,
 * book: { title, author, cover_url } }] }.
 */
export async function GET() {
  if (!FEATURE_MARKETPLACE) return disabledResponse()
  const sb = getServerClient()
  if (!sb) return missingSupabaseResponse()

  const { data, error } = await sb
    .from("marketplace_listings")
    .select(
      "id,book_id,description,price_cents,created_at,books!inner(title,author,cover_url)",
    )
    .order("created_at", { ascending: false })

  if (error) {
    return Response.json(
      { error: `Error listando el mercado: ${error.message}` },
      { status: 500 },
    )
  }
  const listings = (data ?? []).map((row) => {
    const r = row as unknown as {
      id: string
      book_id: string
      description: string | null
      price_cents: number
      created_at: string
      books: { title: string; author: string | null; cover_url: string | null }
    }
    const joined = r.books
    const bookInfo = Array.isArray(joined) ? joined[0] : joined
    return {
      id: r.id,
      book_id: r.book_id,
      description: r.description,
      price_cents: r.price_cents,
      created_at: r.created_at,
      book: bookInfo ?? { title: "Sin título", author: null, cover_url: null },
    }
  })
  return Response.json({ listings })
}

/**
 * POST /api/marketplace — publica un libro propio.
 * Body: { bookId, description?, priceCents? }. Header opcional: x-device-id.
 * Responde 201 { listing }.
 */
export async function POST(req: Request) {
  if (!FEATURE_MARKETPLACE) return disabledResponse()

  const body = await req.json().catch(() => null)
  const valid = validatePublishBody(body)
  if (!valid.ok) {
    return Response.json({ error: valid.error }, { status: 400 })
  }

  const sb = getServerClient()
  if (!sb) return missingSupabaseResponse()

  try {
    const listing = await publishListing(supabaseMarketplaceStore(sb), {
      ...valid.value,
      deviceId: resolveDeviceId(req.headers.get("x-device-id")),
    })
    return Response.json({ listing }, { status: 201 })
  } catch (e) {
    if (e instanceof MarketplaceError) {
      return Response.json({ error: e.message }, { status: errorStatus(e.code) })
    }
    throw e
  }
}
