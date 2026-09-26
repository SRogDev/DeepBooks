export interface ChunkOptions {
  /** Tamaño máximo de cada fragmento en caracteres (~500 tokens ≈ 2000). */
  sizeChars?: number
  /** Solapamiento entre fragmentos consecutivos, en caracteres. */
  overlapChars?: number
}

/**
 * Divide un texto en fragmentos de como máximo `sizeChars`, con un
 * solapamiento de `overlapChars` entre consecutivos.
 *
 * Aproximación documentada: contamos caracteres, no tokens (sin tiktoken
 * a propósito: dependencia nativa innecesaria para el MVP). ~4 chars/token
 * en español/inglés, así que 2000 chars ≈ 500 tokens.
 *
 * Garantías: ningún fragmento supera `sizeChars`; el fragmento N+1 contiene
 * los últimos `overlapChars` del fragmento N (corta por párrafos — `\n\n` —
 * o por fin de frase cuando puede, a la fuerza si no).
 */
export function chunkText(text: string, options: ChunkOptions = {}): string[] {
  const size = options.sizeChars ?? 2000
  const overlap = Math.min(options.overlapChars ?? 200, Math.floor(size / 2))
  const clean = text.replace(/\r\n?/g, "\n").trim()
  if (!clean) return []

  const chunks: string[] = []
  let start = 0
  while (start < clean.length) {
    let end = Math.min(start + size, clean.length)
    if (end < clean.length) {
      const window = clean.slice(start, end)
      const lastPara = window.lastIndexOf("\n\n")
      if (lastPara > size * 0.5) {
        end = start + lastPara
      } else {
        const lastSentence = Math.max(
          window.lastIndexOf(". "),
          window.lastIndexOf(".\n"),
        )
        if (lastSentence > size * 0.5) end = start + lastSentence + 1
      }
    }
    chunks.push(clean.slice(start, end))
    if (end >= clean.length) break
    start = end - overlap
  }
  return chunks.filter((c) => c.length > 0)
}
