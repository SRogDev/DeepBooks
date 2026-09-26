/**
 * Cableado compartido de la orquestación generativa con Supabase + OpenRouter.
 * Lo usan POST /api/generate (bajo demanda, Fase 2) y POST /api/ambient
 * (momentos ambientales, Fase 3). Los tests usan stubs vía
 * GenerateServiceDeps directamente.
 */
import type { SupabaseClient } from "@supabase/supabase-js"
import { embedTexts } from "@/lib/ingest/embeddings"
import { DEFAULT_PAUTAS } from "@/lib/pautas"
import { chatCompletion, type ContextChunk } from "@/lib/generate/engine"
import {
  type BookContext,
  type GenerateServiceDeps,
  type SaveMomentoInput,
} from "@/lib/generate/service"
import type { PautaRow, SectionRow } from "@/lib/supabase/db-types"

interface MatchChunkRow {
  chunk_text: string
  section_idx: number
  section_title: string | null
}

/** Cablea la orquestación con Supabase + OpenRouter reales. */
export function buildGenerateDeps(
  sb: SupabaseClient,
  apiKey: string,
  model: string,
): GenerateServiceDeps {
  return {
    async loadContext(
      bookId: string,
      sectionId?: string,
    ): Promise<BookContext | null> {
      const { data: book } = await sb
        .from("books")
        .select("id,title,author")
        .eq("id", bookId)
        .single()
      if (!book) return null

      const { data: pauta } = await sb
        .from("pautas")
        .select("content")
        .eq("book_id", bookId)
        .single()

      let anchor: BookContext["anchor"] = null
      if (sectionId) {
        const { data: sec } = await sb
          .from("sections")
          .select("id,idx,title,text")
          .eq("id", sectionId)
          .eq("book_id", bookId)
          .single()
        const s = sec as SectionRow | null
        if (s) anchor = { id: s.id, idx: s.idx, title: s.title, text: s.text }
      }

      return {
        bookId: book.id as string,
        title: book.title as string,
        author: book.author as string | null,
        pautas: (pauta as PautaRow | null)?.content ?? DEFAULT_PAUTAS,
        anchor,
      }
    },

    async embedQuery(text: string): Promise<number[]> {
      const [vec] = await embedTexts([text], { apiKey })
      return vec
    },

    async findChunks(
      bookId: string,
      embedding: number[],
      k: number,
    ): Promise<ContextChunk[]> {
      const { data, error } = await sb.rpc("match_chunks", {
        p_book_id: bookId,
        p_query_embedding: `[${embedding.join(",")}]`,
        p_k: k,
      })
      if (error) {
        throw new Error(`Error en búsqueda RAG: ${error.message}`)
      }
      return ((data ?? []) as MatchChunkRow[]).map((r) => ({
        text: r.chunk_text,
        sectionIdx: r.section_idx,
        sectionTitle: r.section_title,
      }))
    },

    async chat(system: string, user: string): Promise<string> {
      return chatCompletion({ apiKey, model, system, user })
    },

    async saveMomento(input: SaveMomentoInput): Promise<string> {
      const { data, error } = await sb
        .from("momentos")
        .insert({
          book_id: input.bookId,
          kind: input.kind ?? "text",
          prompt: input.prompt,
          output_text: input.text,
          anchor_section_id: input.sectionId ?? null,
          origin: input.origin ?? "on_demand",
        })
        .select("id")
        .single()
      if (error || !data) {
        throw new Error(
          `Error guardando el Momento: ${error?.message ?? "desconocido"}`,
        )
      }
      return (data as { id: string }).id
    },
  }
}
