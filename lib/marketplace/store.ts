import type { SupabaseClient } from "@supabase/supabase-js"

/**
 * Puerto de persistencia del mercado. La lógica de negocio (service.ts) solo
 * habla contra esta interfaz; los tests inyectan un fake en memoria y las
 * rutas usan el adaptador Supabase de abajo.
 *
 * Intencionalmente NO expone momentos: adquirir un libro nunca copia los
 * momentos del publicador.
 */

export interface StoredBook {
  id: string
  owner_id: string | null
  title: string
  author: string | null
  cover_url: string | null
  file_url: string | null
  language: string
}

export interface StoredListing {
  id: string
  book_id: string
  description: string | null
  price_cents: number
  created_at: string
  /** Dueño del libro publicado (para autorizar retirar la publicación). */
  owner_id: string | null
}

export interface SectionCopy {
  idx: number
  title: string | null
  text: string
}

export interface ChunkCopy {
  section_idx: number
  chunk_idx: number
  text: string
  /** Valor crudo del vector (se re-inserta tal cual). */
  embedding: unknown
}

export interface BookBundle {
  book: StoredBook
  sections: SectionCopy[]
  chunks: ChunkCopy[]
  pautas: { content: string; is_default: boolean } | null
}

export interface MarketplaceStore {
  findBook(id: string): Promise<StoredBook | null>
  findListingByBookId(bookId: string): Promise<StoredListing | null>
  findListing(id: string): Promise<StoredListing | null>
  insertListing(input: {
    book_id: string
    description: string | null
    price_cents: number
  }): Promise<StoredListing>
  removeListing(id: string): Promise<void>
  fetchBookBundle(bookId: string): Promise<BookBundle | null>
  insertBookCopy(input: {
    title: string
    author: string | null
    cover_url: string | null
    file_url: string | null
    language: string
    owner_id: string | null
    source_type: "marketplace"
  }): Promise<string>
  /** Inserta secciones y devuelve los nuevos ids en orden. */
  insertSections(bookId: string, sections: SectionCopy[]): Promise<string[]>
  insertChunks(
    bookId: string,
    chunks: { section_id: string; chunk_idx: number; text: string; embedding: unknown }[],
  ): Promise<void>
  insertPautas(
    bookId: string,
    content: string,
    is_default: boolean,
  ): Promise<void>
  removeBook(id: string): Promise<void>
}

/** Adaptador Supabase del puerto. */
export function supabaseMarketplaceStore(
  sb: SupabaseClient,
): MarketplaceStore {
  return {
    async findBook(id) {
      const { data, error } = await sb
        .from("books")
        .select("id,owner_id,title,author,cover_url,file_url,language")
        .eq("id", id)
        .single()
      if (error || !data) return null
      return data as StoredBook
    },

    async findListingByBookId(bookId) {
      const { data, error } = await sb
        .from("marketplace_listings")
        .select("id,book_id,description,price_cents,created_at")
        .eq("book_id", bookId)
        .maybeSingle()
      if (error || !data) return null
      const owner = await sb
        .from("books")
        .select("owner_id")
        .eq("id", bookId)
        .single()
      return {
        ...(data as Omit<StoredListing, "owner_id">),
        owner_id: owner.data?.owner_id ?? null,
      }
    },

    async findListing(id) {
      const { data, error } = await sb
        .from("marketplace_listings")
        .select("id,book_id,description,price_cents,created_at")
        .eq("id", id)
        .single()
      if (error || !data) return null
      const owner = await sb
        .from("books")
        .select("owner_id")
        .eq("id", (data as { book_id: string }).book_id)
        .single()
      return {
        ...(data as Omit<StoredListing, "owner_id">),
        owner_id: owner.data?.owner_id ?? null,
      }
    },

    async insertListing(input) {
      const { data, error } = await sb
        .from("marketplace_listings")
        .insert(input)
        .select("id,book_id,description,price_cents,created_at")
        .single()
      if (error || !data) throw new Error(`insert listing: ${error?.message}`)
      const l = data as Omit<StoredListing, "owner_id">
      return { ...l, owner_id: null }
    },

    async removeListing(id) {
      const { error } = await sb.from("marketplace_listings").delete().eq("id", id)
      if (error) throw new Error(`delete listing: ${error.message}`)
    },

    async fetchBookBundle(bookId) {
      const book = await this.findBook(bookId)
      if (!book) return null
      const { data: sections, error: sErr } = await sb
        .from("sections")
        .select("id,idx,title,text")
        .eq("book_id", bookId)
        .order("idx")
      if (sErr) throw new Error(`fetch sections: ${sErr.message}`)
      const { data: chunks, error: cErr } = await sb
        .from("chunks")
        .select("section_id,text,chunk_idx,embedding")
        .eq("book_id", bookId)
        .order("chunk_idx")
      if (cErr) throw new Error(`fetch chunks: ${cErr.message}`)
      const { data: pautas } = await sb
        .from("pautas")
        .select("content,is_default")
        .eq("book_id", bookId)
        .maybeSingle()

      const sectionIdToIdx = new Map(
        (sections ?? []).map((s: { id: string; idx: number }) => [s.id, s.idx]),
      )
      return {
        book,
        sections: (sections ?? []).map(
          (s: { idx: number; title: string | null; text: string }) => ({
            idx: s.idx,
            title: s.title,
            text: s.text,
          }),
        ),
        chunks: (chunks ?? []).map(
          (c: {
            section_id: string
            chunk_idx: number
            text: string
            embedding: unknown
          }) => ({
            section_idx: sectionIdToIdx.get(c.section_id) ?? 0,
            chunk_idx: c.chunk_idx,
            text: c.text,
            embedding: c.embedding,
          }),
        ),
        pautas: pautas
          ? {
              content: (pautas as { content: string }).content,
              is_default: (pautas as { is_default: boolean }).is_default,
            }
          : null,
      }
    },

    async insertBookCopy(input) {
      const { data, error } = await sb
        .from("books")
        .insert({ ...input, last_section_idx: 0 })
        .select("id")
        .single()
      if (error || !data)
        throw new Error(`insert book copy: ${error?.message}`)
      return (data as { id: string }).id
    },

    async insertSections(bookId, sections) {
      const { data, error } = await sb
        .from("sections")
        .insert(sections.map((s) => ({ book_id: bookId, ...s })))
        .select("id,idx")
      if (error) throw new Error(`insert sections: ${error.message}`)
      const byIdx = new Map(
        (data ?? []).map((r: { id: string; idx: number }) => [r.idx, r.id]),
      )
      return sections.map((s) => {
        const id = byIdx.get(s.idx)
        if (!id) throw new Error("insert sections: faltan ids")
        return id
      })
    },

    async insertChunks(bookId, chunks) {
      if (chunks.length === 0) return
      const { error } = await sb
        .from("chunks")
        .insert(chunks.map((c) => ({ book_id: bookId, ...c })))
      if (error) throw new Error(`insert chunks: ${error.message}`)
    },

    async insertPautas(bookId, content, is_default) {
      const { error } = await sb
        .from("pautas")
        .insert({ book_id: bookId, content, is_default })
      if (error) throw new Error(`insert pautas: ${error.message}`)
    },

    async removeBook(id) {
      await sb.from("books").delete().eq("id", id)
    },
  }
}
