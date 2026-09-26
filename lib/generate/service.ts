/**
 * Orquestación de la generación bajo demanda (Fase 2).
 * Todas las dependencias se inyectan: el route handler cablea las reales
 * (Supabase + OpenRouter) y los tests usan stubs.
 */
import {
  RETRIEVAL_K,
  buildSystemPrompt,
  buildUserMessage,
  type AnchorSection,
  type ContextChunk,
  type GenerateInput,
} from "./engine"

export class NotFoundError extends Error {}

export interface BookContext {
  bookId: string
  title: string
  author: string | null
  pautas: string
  anchor: AnchorSection | null
}

export interface SaveMomentoInput {
  bookId: string
  prompt: string
  text: string
  sectionId?: string
}

export interface GenerateServiceDeps {
  loadContext(bookId: string, sectionId?: string): Promise<BookContext | null>
  embedQuery(text: string): Promise<number[]>
  findChunks(
    bookId: string,
    embedding: number[],
    k: number,
  ): Promise<ContextChunk[]>
  chat(system: string, user: string): Promise<string>
  saveMomento(input: SaveMomentoInput): Promise<string>
}

export interface GenerateResult {
  momentoId: string
  text: string
}

/**
 * Genera un Momento bajo demanda: contexto del libro + pautas + RAG →
 * LLM → persistencia. Lanza NotFoundError si el libro no existe.
 */
export async function generateOnDemand(
  input: GenerateInput,
  deps: GenerateServiceDeps,
): Promise<GenerateResult> {
  const ctx = await deps.loadContext(input.bookId, input.sectionId)
  if (!ctx) throw new NotFoundError("Libro no encontrado.")

  const embedding = await deps.embedQuery(input.prompt)
  const chunks = await deps.findChunks(input.bookId, embedding, RETRIEVAL_K)

  const system = buildSystemPrompt(ctx.pautas, ctx.title, ctx.author)
  const user = buildUserMessage(input.prompt, ctx.anchor, chunks)
  const text = await deps.chat(system, user)

  const momentoId = await deps.saveMomento({
    bookId: input.bookId,
    prompt: input.prompt,
    text,
    sectionId: input.sectionId,
  })
  return { momentoId, text }
}
