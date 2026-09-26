export interface EmbedOptions {
  apiKey?: string
  model?: string
  /** Textos por request (OpenRouter acepta lotes). */
  batchSize?: number
}

interface EmbeddingResponse {
  data: { embedding: number[] }[]
}

const EMBEDDING_URL = "https://openrouter.ai/api/v1/embeddings"
const DEFAULT_MODEL = "openai/text-embedding-3-small"

/**
 * Embeddings vía OpenRouter (fetch directo, sin SDK).
 * Procesa en lotes de `batchSize` (defecto 50) para no saturar el request.
 */
export async function embedTexts(
  texts: string[],
  options: EmbedOptions = {},
): Promise<number[][]> {
  const apiKey = options.apiKey ?? process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    throw new Error(
      "OPENROUTER_API_KEY no está configurada. Define la variable de entorno.",
    )
  }
  const model =
    options.model ?? process.env.OPENROUTER_EMBEDDING_MODEL ?? DEFAULT_MODEL
  const batchSize = options.batchSize ?? 50

  const out: number[][] = []
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize)
    const res = await fetch(EMBEDDING_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://deepbooks.app",
        "X-Title": "DeepBooks",
      },
      body: JSON.stringify({ model, input: batch }),
    })
    if (!res.ok) {
      const detail = await res.text().catch(() => "")
      throw new Error(
        `OpenRouter embeddings falló (${res.status}): ${detail.slice(0, 200)}`,
      )
    }
    const json = (await res.json()) as EmbeddingResponse
    if (!Array.isArray(json.data) || json.data.length !== batch.length) {
      throw new Error("OpenRouter devolvió embeddings incompletos")
    }
    for (const d of json.data) out.push(d.embedding)
  }
  return out
}
