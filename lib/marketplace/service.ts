import type { MarketplaceStore, StoredListing } from "./store"

/**
 * Lógica de negocio del mercado (pura respecto a I/O: recibe el store).
 *
 * Reglas:
 * - Publicar: el libro debe existir; si tiene dueño, el dispositivo debe
 *   coincidir (libro ajeno → forbidden); no duplicar publicación.
 * - Retirar: solo el dueño del libro publicado.
 * - Adquirir: copia libro + secciones + chunks (con embeddings) + pautas al
 *   nuevo dueño; NUNCA momentos. Si la copia falla a mitad, rollback.
 */

export type MarketplaceErrorCode =
  | "book-not-found"
  | "listing-not-found"
  | "forbidden"
  | "already-listed"

export class MarketplaceError extends Error {
  readonly code: MarketplaceErrorCode
  constructor(code: MarketplaceErrorCode, message: string) {
    super(message)
    this.code = code
  }
}

export async function publishListing(
  store: MarketplaceStore,
  input: {
    bookId: string
    description: string | null
    priceCents: number
    deviceId: string | null
  },
): Promise<StoredListing> {
  const book = await store.findBook(input.bookId)
  if (!book) {
    throw new MarketplaceError("book-not-found", "Libro no encontrado.")
  }
  if (book.owner_id && book.owner_id !== input.deviceId) {
    throw new MarketplaceError(
      "forbidden",
      "Solo puedes publicar tus propios libros.",
    )
  }
  const existing = await store.findListingByBookId(input.bookId)
  if (existing) {
    throw new MarketplaceError(
      "already-listed",
      "Este libro ya está publicado en el mercado.",
    )
  }
  return store.insertListing({
    book_id: input.bookId,
    description: input.description,
    price_cents: input.priceCents,
  })
}

export async function unpublishListing(
  store: MarketplaceStore,
  input: { listingId: string; deviceId: string | null },
): Promise<void> {
  const listing = await store.findListing(input.listingId)
  if (!listing) {
    throw new MarketplaceError("listing-not-found", "Publicación no encontrada.")
  }
  if (listing.owner_id && listing.owner_id !== input.deviceId) {
    throw new MarketplaceError(
      "forbidden",
      "Solo el dueño puede retirar esta publicación.",
    )
  }
  await store.removeListing(input.listingId)
}

export async function acquireListing(
  store: MarketplaceStore,
  input: { listingId: string; deviceId: string | null },
): Promise<{ bookId: string }> {
  const listing = await store.findListing(input.listingId)
  if (!listing) {
    throw new MarketplaceError("listing-not-found", "Publicación no encontrada.")
  }
  const bundle = await store.fetchBookBundle(listing.book_id)
  if (!bundle) {
    throw new MarketplaceError(
      "listing-not-found",
      "El libro de esta publicación ya no existe.",
    )
  }

  const newBookId = await store.insertBookCopy({
    title: bundle.book.title,
    author: bundle.book.author,
    cover_url: bundle.book.cover_url,
    file_url: bundle.book.file_url,
    language: bundle.book.language,
    owner_id: input.deviceId,
    source_type: "marketplace",
  })

  try {
    const newSectionIds = await store.insertSections(newBookId, bundle.sections)
    await store.insertChunks(
      newBookId,
      bundle.chunks.map((c) => ({
        section_id: newSectionIds[c.section_idx] ?? newSectionIds[0],
        chunk_idx: c.chunk_idx,
        text: c.text,
        embedding: c.embedding,
      })),
    )
    if (bundle.pautas) {
      await store.insertPautas(
        newBookId,
        bundle.pautas.content,
        bundle.pautas.is_default,
      )
    }
  } catch (e) {
    // Rollback best-effort: no dejar una copia a medias en la biblioteca.
    await store.removeBook(newBookId).catch(() => {})
    throw e
  }

  return { bookId: newBookId }
}
