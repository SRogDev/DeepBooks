/** Tipos del pipeline de ingesta de documentos (Fase 1) */

export interface DocSection {
  title: string | null
  text: string
}

export interface ParsedDocument {
  title: string | null
  author: string | null
  sections: DocSection[]
}

export type SupportedExt = "pdf" | "epub" | "docx" | "txt" | "md"

export class UnsupportedFormatError extends Error {
  constructor(filename: string) {
    super(
      `Formato no soportado: ${filename}. Usa PDF, EPUB, DOCX, TXT o MD.`,
    )
    this.name = "UnsupportedFormatError"
  }
}
