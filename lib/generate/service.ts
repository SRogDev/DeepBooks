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
import type { AmbientPromptItem } from "@/lib/ambient/prompts"
import type { MomentoKind, MomentoOrigin } from "@/lib/supabase/db-types"

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
  kind?: MomentoKind
  origin?: MomentoOrigin
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

export interface AmbientInput {
  bookId: string
  sectionId?: string
  /** Consigna creativa elegida del bank (el lector no la ve de antemano). */
  item: AmbientPromptItem
}

export interface AmbientResult extends GenerateResult {
  kind: MomentoKind
}

/**
 * Genera un Momento ambiental: sorpresa sin prompt del lector.
 * Misma tubería que on-demand (pautas como system prompt + RAG + LLM),
 * pero la consigna viene del bank interno de ideas creativas y el
 * artefacto se guarda con origin 'ambient'.
 */
export async function generateAmbient(
  input: AmbientInput,
  deps: GenerateServiceDeps,
): Promise<AmbientResult> {
  const ctx = await deps.loadContext(input.bookId, input.sectionId)
  if (!ctx) throw new NotFoundError("Libro no encontrado.")

  const embedding = await deps.embedQuery(input.item.prompt)
  const chunks = await deps.findChunks(input.bookId, embedding, RETRIEVAL_K)

  const system = buildSystemPrompt(ctx.pautas, ctx.title, ctx.author)
  const user = buildUserMessage(
    input.item.prompt,
    ctx.anchor,
    chunks,
    `Sorpresa para el lector (${input.item.label.toLowerCase()})`,
  )
  const text = await deps.chat(system, user)

  const momentoId = await deps.saveMomento({
    bookId: input.bookId,
    prompt: input.item.prompt,
    text,
    sectionId: input.sectionId,
    kind: input.item.kind,
    origin: "ambient",
  })
  return { momentoId, text, kind: input.item.kind }
}
