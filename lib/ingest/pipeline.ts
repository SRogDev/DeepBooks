import type { SupabaseClient } from "@supabase/supabase-js"
import { parseDocument } from "./parsers"
import { chunkText } from "./chunker"
import { embedTexts } from "./embeddings"

// La fuente de verdad vive en lib/pautas.ts (importable desde cliente sin
// pdf-parse); se re-exporta para no romper importadores existentes.
import { DEFAULT_PAUTAS } from "@/lib/pautas"
export { DEFAULT_PAUTAS }

export interface IngestInput {
  file: Buffer
  filename: string
  title?: string
  author?: string
}

export interface IngestResult {
  bookId: string
  sections: number
  chunks: number
}

/** Filas de chunks por insert (evita payloads gigantes). */
const CHUNK_INSERT_BATCH = 100

function baseName(filename: string): string {
  const name = filename.split(/[\\/]/).pop() ?? filename
  return (
    name.replace(/\.[a-z0-9]+$/i, "").replace(/[_-]+/g, " ").trim() ||
    "Sin título"
  )
}

/**
 * Pipeline de ingesta: parse → secciones → chunks → embeddings → Supabase.
 * Inserta el libro, sus secciones, los chunks con embedding y la fila de
 * pautas por defecto. Lanza Error con mensaje claro ante cualquier fallo.
 */
export async function ingestDocument(
  sb: SupabaseClient,
  input: IngestInput,
): Promise<IngestResult> {
  const parsed = await parseDocument(input.file, input.filename)
  if (parsed.sections.length === 0) {
    throw new Error("No se pudo extraer texto del documento")
  }

  const title = input.title?.trim() || parsed.title || baseName(input.filename)
  const author = input.author?.trim() || parsed.author || null

  const bookRes = await sb
    .from("books")
    .insert({ title, author, source_type: "upload", language: "es" })
    .select("id")
    .single()
  const book = bookRes.data as { id: string } | null
  if (bookRes.error || !book) {
    throw new Error(
      `Error creando el libro: ${bookRes.error?.message ?? "desconocido"}`,
    )
  }

  const secRes = await sb
    .from("sections")
    .insert(
      parsed.sections.map((s, idx) => ({
        book_id: book.id,
        idx,
        title: s.title,
        text: s.text,
      })),
    )
    .select("id,idx")
  const sectionRows = secRes.data as { id: string; idx: number }[] | null
  if (secRes.error || !sectionRows) {
    throw new Error(
      `Error guardando secciones: ${secRes.error?.message ?? "desconocido"}`,
    )
  }
  const sectionIdByIdx = new Map(sectionRows.map((r) => [r.idx, r.id]))

  const pending: { section_id: string; text: string }[] = []
  parsed.sections.forEach((sec, secIdx) => {
    const sectionId = sectionIdByIdx.get(secIdx)
    if (!sectionId) return
    for (const t of chunkText(sec.text)) {
      pending.push({ section_id: sectionId, text: t })
    }
  })

  const embeddings = await embedTexts(pending.map((p) => p.text))

  const chunkRows = pending.map((p, i) => ({
    book_id: book.id,
    section_id: p.section_id,
    chunk_idx: i,
    text: p.text,
    embedding: embeddings[i],
  }))
  for (let i = 0; i < chunkRows.length; i += CHUNK_INSERT_BATCH) {
    const { error } = await sb
      .from("chunks")
      .insert(chunkRows.slice(i, i + CHUNK_INSERT_BATCH))
    if (error) throw new Error(`Error guardando fragmentos: ${error.message}`)
  }

  const { error: pautaError } = await sb.from("pautas").insert({
    book_id: book.id,
    content: DEFAULT_PAUTAS,
    is_default: true,
  })
  if (pautaError) {
    throw new Error(`Error guardando pautas: ${pautaError.message}`)
  }

  return {
    bookId: book.id,
    sections: parsed.sections.length,
    chunks: chunkRows.length,
  }
}
