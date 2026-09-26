import type { SupabaseClient } from "@supabase/supabase-js"
import { getServerClient, missingSupabaseResponse } from "@/lib/supabase/server"
import { embedTexts } from "@/lib/ingest/embeddings"
import { DEFAULT_PAUTAS } from "@/lib/pautas"
import {
  chatCompletion,
  resolveChatModel,
  validateGenerateBody,
  type ContextChunk,
} from "@/lib/generate/engine"
import {
  generateOnDemand,
  NotFoundError,
  type BookContext,
  type GenerateServiceDeps,
  type SaveMomentoInput,
} from "@/lib/generate/service"
import type { PautaRow, SectionRow } from "@/lib/supabase/db-types"

export const dynamic = "force-dynamic"

function missingOpenRouterResponse() {
  return Response.json(
    {
      error:
        "OPENROUTER_API_KEY no está configurada. Define la variable de " +
        "entorno para usar la generación.",
    },
    { status: 503 },
  )
}

interface MatchChunkRow {
  chunk_text: string
  section_idx: number
  section_title: string | null
}

/** Cablea la orquestación con Supabase + OpenRouter reales. */
function buildDeps(
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
          kind: "text",
          prompt: input.prompt,
          output_text: input.text,
          anchor_section_id: input.sectionId ?? null,
          origin: "on_demand",
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

/**
 * POST /api/generate — generación bajo demanda anclada a una posición.
 * Body: { bookId, sectionId?, prompt }
 * Responde { momentoId, text }. El artefacto queda guardado en Momentos.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const valid = validateGenerateBody(body)
  if (!valid.ok) {
    return Response.json({ error: valid.error }, { status: 400 })
  }

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) return missingOpenRouterResponse()
  const sb = getServerClient()
  if (!sb) return missingSupabaseResponse()

  try {
    const result = await generateOnDemand(
      valid.value,
      buildDeps(sb, apiKey, resolveChatModel()),
    )
    return Response.json(result)
  } catch (e) {
    if (e instanceof NotFoundError) {
      return Response.json({ error: e.message }, { status: 404 })
    }
    if (e instanceof Error && e.message.includes("OpenRouter")) {
      return Response.json({ error: e.message }, { status: 502 })
    }
    return Response.json(
      { error: e instanceof Error ? e.message : "Error generando." },
      { status: 500 },
    )
  }
}
