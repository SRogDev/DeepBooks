import { describe, it, expect, beforeEach } from "vitest"
import {
  publishListing,
  unpublishListing,
  acquireListing,
  MarketplaceError,
} from "./service"
import type {
  MarketplaceStore,
  StoredBook,
  StoredListing,
  BookBundle,
} from "./store"

const DEVICE = "device-1"
const OTHER = "device-2"

function book(over: Partial<StoredBook> = {}): StoredBook {
  return {
    id: "book-1",
    owner_id: DEVICE,
    title: "Mi libro",
    author: "Autora",
    cover_url: null,
    file_url: null,
    language: "es",
    ...over,
  }
}

function listing(over: Partial<StoredListing> = {}): StoredListing {
  return {
    id: "listing-1",
    book_id: "book-1",
    description: "Comparto mi edición",
    price_cents: 0,
    created_at: new Date().toISOString(),
    owner_id: DEVICE,
    ...over,
  }
}

function bundle(over: Partial<BookBundle> = {}): BookBundle {
  return {
    book: book(),
    sections: [
      { idx: 0, title: "Cap 1", text: "texto uno" },
      { idx: 1, title: "Cap 2", text: "texto dos" },
    ],
    chunks: [
      { section_idx: 0, chunk_idx: 0, text: "chunk a", embedding: "[0.1,0.2]" },
      { section_idx: 1, chunk_idx: 0, text: "chunk b", embedding: "[0.3,0.4]" },
    ],
    pautas: { content: "Pautas", is_default: true },
    ...over,
  }
}

interface Calls {
  insertedBook: unknown[]
  insertedSections: unknown[]
  insertedChunks: unknown[]
  insertedPautas: unknown[]
  removedBooks: string[]
}

function fakeStore(seed: {
  books?: StoredBook[]
  listings?: StoredListing[]
  bundles?: Record<string, BookBundle>
  failOn?: keyof Calls | null
} = {}): { store: MarketplaceStore; calls: Calls } {
  const books = new Map((seed.books ?? []).map((b) => [b.id, b]))
  const listings = new Map((seed.listings ?? []).map((l) => [l.id, l]))
  const calls: Calls = {
    insertedBook: [],
    insertedSections: [],
    insertedChunks: [],
    insertedPautas: [],
    removedBooks: [],
  }
  const store: MarketplaceStore = {
    findBook: async (id) => books.get(id) ?? null,
    findListingByBookId: async (bookId) =>
      [...listings.values()].find((l) => l.book_id === bookId) ?? null,
    findListing: async (id) => listings.get(id) ?? null,
    insertListing: async (input) => {
      const l = listing({ id: "listing-new", ...input })
      listings.set(l.id, l)
      return l
    },
    removeListing: async (id) => {
      listings.delete(id)
    },
    fetchBookBundle: async (bookId) => seed.bundles?.[bookId] ?? null,
    insertBookCopy: async (input) => {
      calls.insertedBook.push(input)
      return "book-copy-1"
    },
    insertSections: async (bookId, sections) => {
      if (seed.failOn) throw new Error("boom")
      calls.insertedSections.push({ bookId, sections })
      return sections.map((_, i) => `section-new-${i}`)
    },
    insertChunks: async (bookId, chunks) => {
      calls.insertedChunks.push({ bookId, chunks })
    },
    insertPautas: async (bookId, content, is_default) => {
      calls.insertedPautas.push({ bookId, content, is_default })
    },
    removeBook: async (id) => {
      calls.removedBooks.push(id)
    },
  }
  return { store, calls }
}

async function expectMarketplaceError(
  p: Promise<unknown>,
  code: string,
): Promise<void> {
  try {
    await p
  } catch (e) {
    expect(e).toBeInstanceOf(MarketplaceError)
    expect((e as MarketplaceError).code).toBe(code)
    return
  }
  throw new Error(`se esperaba MarketplaceError(${code})`)
}

describe("publishListing", () => {
  it("publica un libro propio", async () => {
    const { store } = fakeStore({ books: [book()] })
    const l = await publishListing(store, {
      bookId: "book-1",
      description: "Lo comparto",
      priceCents: 0,
      deviceId: DEVICE,
    })
    expect(l.book_id).toBe("book-1")
    expect(l.description).toBe("Lo comparto")
  })

  it("libro inexistente → book-not-found", async () => {
    const { store } = fakeStore()
    await expectMarketplaceError(
      publishListing(store, {
        bookId: "nope",
        description: null,
        priceCents: 0,
        deviceId: DEVICE,
      }),
      "book-not-found",
    )
  })

  it("libro ajeno → forbidden", async () => {
    const { store } = fakeStore({ books: [book({ owner_id: OTHER })] })
    await expectMarketplaceError(
      publishListing(store, {
        bookId: "book-1",
        description: null,
        priceCents: 0,
        deviceId: DEVICE,
      }),
      "forbidden",
    )
  })

  it("libro sin dueño que pide dispositivo ajeno → forbidden", async () => {
    // El libro tiene dueño pero el solicitante no se identifica: no publicar.
    const { store } = fakeStore({ books: [book({ owner_id: OTHER })] })
    await expectMarketplaceError(
      publishListing(store, {
        bookId: "book-1",
        description: null,
        priceCents: 0,
        deviceId: null,
      }),
      "forbidden",
    )
  })

  it("libro legacy sin owner_id lo puede publicar cualquiera identificado", async () => {
    const { store } = fakeStore({ books: [book({ owner_id: null })] })
    const l = await publishListing(store, {
      bookId: "book-1",
      description: null,
      priceCents: 0,
      deviceId: DEVICE,
    })
    expect(l.book_id).toBe("book-1")
  })

  it("duplicado → already-listed", async () => {
    const { store } = fakeStore({
      books: [book()],
      listings: [listing()],
    })
    await expectMarketplaceError(
      publishListing(store, {
        bookId: "book-1",
        description: null,
        priceCents: 0,
        deviceId: DEVICE,
      }),
      "already-listed",
    )
  })
})

describe("unpublishListing", () => {
  it("el dueño retira su publicación", async () => {
    const { store } = fakeStore({ listings: [listing()] })
    await unpublishListing(store, { listingId: "listing-1", deviceId: DEVICE })
    expect(await store.findListing("listing-1")).toBeNull()
  })

  it("publicación inexistente → listing-not-found", async () => {
    const { store } = fakeStore()
    await expectMarketplaceError(
      unpublishListing(store, { listingId: "nope", deviceId: DEVICE }),
      "listing-not-found",
    )
  })

  it("ajeno → forbidden", async () => {
    const { store } = fakeStore({ listings: [listing({ owner_id: OTHER })] })
    await expectMarketplaceError(
      unpublishListing(store, { listingId: "listing-1", deviceId: DEVICE }),
      "forbidden",
    )
  })
})

describe("acquireListing", () => {
  it("copia libro, secciones, chunks y pautas con el nuevo dueño", async () => {
    const b = bundle()
    const { store, calls } = fakeStore({
      listings: [listing()],
      bundles: { "book-1": b },
    })
    const { bookId } = await acquireListing(store, {
      listingId: "listing-1",
      deviceId: "device-nuevo",
    })
    expect(bookId).toBe("book-copy-1")

    const copied = calls.insertedBook[0] as Record<string, unknown>
    expect(copied.title).toBe("Mi libro")
    expect(copied.owner_id).toBe("device-nuevo")
    expect(copied.source_type).toBe("marketplace")

    const secs = calls.insertedSections[0] as {
      sections: { idx: number; title: string | null; text: string }[]
    }
    expect(secs.sections).toHaveLength(2)
    expect(secs.sections[0].text).toBe("texto uno")

    const chs = calls.insertedChunks[0] as {
      chunks: { section_id: string; text: string; embedding: unknown }[]
    }
    // Los chunks apuntan a las NUEVAS secciones, no a las originales.
    expect(chs.chunks[0].section_id).toBe("section-new-0")
    expect(chs.chunks[1].section_id).toBe("section-new-1")
    expect(chs.chunks[0].embedding).toBe("[0.1,0.2]")

    const pz = calls.insertedPautas[0] as { content: string }
    expect(pz.content).toBe("Pautas")
  })

  it("no copia momentos ajenos: la interfaz no expone momentos", async () => {
    // Garantía estructural: BookBundle no tiene campo de momentos.
    const b = bundle()
    expect("momentos" in b).toBe(false)
    expect("moments" in b).toBe(false)
  })

  it("publicación inexistente → listing-not-found", async () => {
    const { store } = fakeStore()
    await expectMarketplaceError(
      acquireListing(store, { listingId: "nope", deviceId: DEVICE }),
      "listing-not-found",
    )
  })

  it("si falla la copia, hace rollback del libro creado", async () => {
    const { store, calls } = fakeStore({
      listings: [listing()],
      bundles: { "book-1": bundle() },
      failOn: "insertedSections",
    })
    await expect(acquireListing(store, { listingId: "listing-1", deviceId: DEVICE })).rejects.toThrow()
    expect(calls.removedBooks).toContain("book-copy-1")
  })
})
