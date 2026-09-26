/**
 * Motor generativo de DeepBooks (Fase 2: generación bajo demanda).
 * Funciones puras de construcción de prompts + cliente de chat OpenRouter.
 * La orquestación con Supabase vive en `service.ts` (inyectable para tests).
 */

export interface ContextChunk {
  text: string
  sectionIdx: number
  sectionTitle: string | null
}

export interface AnchorSection {
  id: string
  idx: number
  title: string | null
  text: string
}

/** Longitud máxima del prompt libre del lector. */
export const MAX_PROMPT_CHARS = 2000
/** Cuántos fragmentos RAG se inyectan como contexto. */
export const RETRIEVAL_K = 6
/** Tope del texto del ancla que viaja al modelo. */
const ANCHOR_MAX_CHARS = 4000

const DEFAULT_CHAT_MODEL = "openai/gpt-4o-mini"
const CHAT_URL = "https://openrouter.ai/api/v1/chat/completions"

/**
 * Compila las pautas del libro en el system prompt de cada generación.
 * Esta es la superficie de "prompt engineering como producto": el editor
 * dirige el comportamiento del modelo en lenguaje natural, por libro.
 */
export function buildSystemPrompt(
  pautas: string,
  bookTitle: string,
  author: string | null,
): string {
  const byline = author ? ` de ${author}` : ""
  return [
    `Eres DeepBooks, un compañero de lectura dentro del libro "${bookTitle}"${byline}.`,
    "",
    "Pautas de experiencia definidas por el editor de este libro:",
    pautas.trim(),
    "",
    "Reglas:",
    "- Todo lo que generes debe estar anclado en el texto del libro que recibes como contexto.",
    "- No inventes personajes, lugares ni hechos que contradigan el libro.",
    "- No reveles giros futuros de la trama salvo que el lector lo pida explícitamente.",
    "- Responde en el mismo idioma del libro (español salvo indicación contraria).",
    "- Sé conciso y vívido: esto acompaña la lectura, no la reemplaza.",
  ].join("\n")
}

/**
 * Mensaje del lector: petición libre + sección ancla (posición de lectura)
 * + fragmentos RAG del libro. `requestLabel` permite reutilizarlo para
 * momentos ambientales, donde no hay petición del lector sino sorpresa.
 */
export function buildUserMessage(
  userPrompt: string,
  anchor: AnchorSection | null,
  context: ContextChunk[],
  requestLabel = "Petición del lector",
): string {
  const parts: string[] = []
  if (anchor) {
    const title = anchor.title ? ` ("${anchor.title}")` : ""
    parts.push(
      `El lector está en la sección ${anchor.idx + 1}${title}:`,
      "",
      anchor.text.slice(0, ANCHOR_MAX_CHARS),
      "",
    )
  }
  if (context.length > 0) {
    parts.push("Fragmentos relevantes del libro:", "")
    for (const c of context) {
      const label = c.sectionTitle
        ? `[Sección ${c.sectionIdx + 1} "${c.sectionTitle}"]`
        : `[Sección ${c.sectionIdx + 1}]`
      parts.push(`— ${label} ${c.text}`)
    }
    parts.push("")
  }
  parts.push(`${requestLabel}: ${userPrompt.trim()}`)
  return parts.join("\n")
}

export interface ChatOptions {
  apiKey: string
  model: string
  system: string
  user: string
  /** Inyección para tests. */
  fetchImpl?: typeof fetch
}

interface ChatResponse {
  choices?: { message?: { content?: unknown } }[]
}

/** Llamada de chat a OpenRouter (fetch directo, sin SDK). */
export async function chatCompletion(opts: ChatOptions): Promise<string> {
  const res = await (opts.fetchImpl ?? fetch)(CHAT_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${opts.apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://deepbooks.app",
      "X-Title": "DeepBooks",
    },
    body: JSON.stringify({
      model: opts.model,
      messages: [
        { role: "system", content: opts.system },
        { role: "user", content: opts.user },
      ],
    }),
  })
  if (!res.ok) {
    const detail = await res.text().catch(() => "")
    throw new Error(
      `OpenRouter chat falló (${res.status}): ${detail.slice(0, 200)}`,
    )
  }
  const json = (await res.json()) as ChatResponse
  const text = json.choices?.[0]?.message?.content
  if (typeof text !== "string" || !text.trim()) {
    throw new Error("OpenRouter devolvió una respuesta vacía")
  }
  return text.trim()
}

/** Modelo de chat: env OPENROUTER_MODEL o el valor por defecto. */
export function resolveChatModel(): string {
  return process.env.OPENROUTER_MODEL ?? DEFAULT_CHAT_MODEL
}

export interface GenerateInput {
  bookId: string
  sectionId?: string
  prompt: string
}

type ValidationResult =
  | { ok: true; value: GenerateInput }
  | { ok: false; error: string }

/** Valida el cuerpo de POST /api/generate en el borde. */
export function validateGenerateBody(body: unknown): ValidationResult {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Cuerpo inválido." }
  }
  const b = body as Record<string, unknown>
  if (typeof b.bookId !== "string" || !b.bookId.trim()) {
    return { ok: false, error: "bookId es obligatorio." }
  }
  if (b.sectionId !== undefined && typeof b.sectionId !== "string") {
    return { ok: false, error: "sectionId inválido." }
  }
  if (typeof b.prompt !== "string" || !b.prompt.trim()) {
    return { ok: false, error: "Escribe qué quieres generar." }
  }
  if (b.prompt.length > MAX_PROMPT_CHARS) {
    return {
      ok: false,
      error: `La petición no puede superar ${MAX_PROMPT_CHARS} caracteres.`,
    }
  }
  return {
    ok: true,
    value: {
      bookId: b.bookId.trim(),
      sectionId: b.sectionId?.trim() || undefined,
      prompt: b.prompt.trim(),
    },
  }
}
