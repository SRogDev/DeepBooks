/**
 * Pautas de experiencia por defecto ("Modo DeepBooks").
 * La ingesta inserta esta fila por libro; el editor de pautas (Fase 2)
 * la reemplaza o la restaura. Vive aquí (sin dependencias pesadas) para
 * poder importarse desde componentes cliente sin arrastrar pdf-parse.
 */
export const DEFAULT_PAUTAS =
  "Modo DeepBooks: acompaña la lectura con momentos generativos sutiles. " +
  "Visualiza escenas vívidas cuando el texto lo pida, haz preguntas que inviten " +
  "a reflexionar sin revelar giros futuros, y mantén un tono cercano y curioso. " +
  "Nunca interrumpas a mitad de una escena: actúa en pausas naturales."
