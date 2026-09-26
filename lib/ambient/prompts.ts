/**
 * Bank de ideas creativas para momentos ambientales (Fase 3).
 * El servidor elige una al azar por generación; el lector nunca la ve
 * de antemano: el momento es una sorpresa anclada en lo que está leyendo.
 */
import type { MomentoKind } from "@/lib/supabase/db-types"

export interface AmbientPromptItem {
  /** Tipo de Momento con el que se guarda el artefacto. */
  kind: MomentoKind
  /** Etiqueta corta para la UI ("Momento ambiental ✦ · Escena alternativa"). */
  label: string
  /** Consigna creativa que se envía al modelo junto al contexto RAG. */
  prompt: string
}

export const AMBIENT_PROMPT_BANK: AmbientPromptItem[] = [
  {
    kind: "branch",
    label: "Escena alternativa",
    prompt:
      "Reimagina lo que el lector acaba de leer como una escena alternativa: " +
      "¿cómo se vería este momento desde la perspectiva de otro personaje, " +
      "o con un giro distinto? Breve y vívido, máximo 150 palabras.",
  },
  {
    kind: "question",
    label: "Para reflexionar",
    prompt:
      "Formula una pregunta profunda que invite al lector a reflexionar sobre " +
      "lo que acaba de leer, conectándola con su propia vida. Solo la pregunta " +
      "y una línea de contexto, nada más.",
  },
  {
    kind: "text",
    label: "Detalle sensorial",
    prompt:
      "Describe con detalle sensorial (sonidos, olores, texturas, luz) el mundo " +
      "del fragmento que el lector acaba de leer, como si estuviera allí mismo. " +
      "Máximo un párrafo.",
  },
  {
    kind: "branch",
    label: "¿Y si…?",
    prompt:
      "Propón un «¿y si…?» creativo sobre lo leído: una bifurcación posible de " +
      "la historia a partir de este punto. Una sola idea, intrigante, en pocas líneas.",
  },
  {
    kind: "text",
    label: "Mini-relato",
    prompt:
      "Escribe un mini-relato (máximo 120 palabras) ambientado en el mundo del " +
      "libro e inspirado en lo que el lector acaba de leer, sin contradecir la historia.",
  },
  {
    kind: "question",
    label: "Conexión",
    prompt:
      "Conecta lo que el lector acaba de leer con una idea, época o lugar del " +
      "mundo real. Una observación breve que enriquezca la lectura, en dos o tres líneas.",
  },
]

/** Elige un prompt al azar (random inyectable para tests). */
export function pickAmbientPrompt(
  random: () => number = Math.random,
): AmbientPromptItem {
  const idx = Math.floor(random() * AMBIENT_PROMPT_BANK.length)
  return AMBIENT_PROMPT_BANK[Math.min(idx, AMBIENT_PROMPT_BANK.length - 1)]
}
