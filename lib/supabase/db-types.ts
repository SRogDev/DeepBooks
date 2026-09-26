/** Filas de Supabase — espejo TS de supabase/migrations/001_init.sql */

export interface BookRow {
  id: string
  owner_id: string | null
  title: string
  author: string | null
  source_type: "upload" | "marketplace"
  file_url: string | null
  cover_url: string | null
  language: string
  last_section_idx: number
  ambient_intensity: "off" | "suave" | "activo"
  last_ambient_at: string | null
  created_at: string
}

export interface SectionRow {
  id: string
  book_id: string
  idx: number
  title: string | null
  text: string
}

export interface ChunkRow {
  id: string
  book_id: string
  section_id: string
  chunk_idx: number
  text: string
  embedding: number[] | null
}

export interface PautaRow {
  id: string
  book_id: string
  content: string
  is_default: boolean
}

export type MomentoKind = "text" | "image" | "audio" | "branch" | "question"
export type MomentoOrigin = "on_demand" | "ambient"

export interface MomentoRow {
  id: string
  book_id: string
  user_id: string | null
  kind: MomentoKind
  prompt: string | null
  output_ref: string | null
  output_text: string | null
  anchor_section_id: string | null
  origin: MomentoOrigin
  created_at: string
}
