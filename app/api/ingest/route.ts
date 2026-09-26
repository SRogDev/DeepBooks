import { NextRequest } from "next/server"
import { getServerClient, missingSupabaseResponse } from "@/lib/supabase/server"
import { ingestDocument } from "@/lib/ingest/pipeline"
import { extOf, UnsupportedFormatError } from "@/lib/ingest/parsers"

export const dynamic = "force-dynamic"
export const maxDuration = 60

/** 25 MB por documento. */
const MAX_FILE_BYTES = 25 * 1024 * 1024

/**
 * POST /api/ingest — multipart con `file` (pdf/epub/docx/txt/md),
 * `title` y `author` opcionales. Ejecuta el pipeline completo
 * (parse → secciones → chunks → embeddings → Supabase) y devuelve
 * { bookId, sections, chunks }.
 */
export async function POST(req: NextRequest) {
  const sb = getServerClient()
  if (!sb) return missingSupabaseResponse()

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return Response.json(
      { error: "Body inválido: envía multipart con el campo `file`." },
      { status: 400 },
    )
  }

  const file = form.get("file")
  if (!(file instanceof File)) {
    return Response.json(
      { error: "Falta el archivo: campo `file` requerido." },
      { status: 400 },
    )
  }
  if (!extOf(file.name)) {
    return Response.json(
      {
        error: `Formato no soportado: ${file.name}. Usa PDF, EPUB, DOCX, TXT o MD.`,
      },
      { status: 400 },
    )
  }
  if (file.size > MAX_FILE_BYTES) {
    return Response.json(
      { error: "El archivo supera el límite de 25 MB." },
      { status: 400 },
    )
  }
  if (file.size === 0) {
    return Response.json({ error: "El archivo está vacío." }, { status: 400 })
  }

  const title = form.get("title")
  const author = form.get("author")
  const rawOwner = form.get("ownerId")
  const ownerId =
    typeof rawOwner === "string" && rawOwner.trim().length > 0 && rawOwner.length <= 128
      ? rawOwner.trim()
      : undefined

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const result = await ingestDocument(sb, {
      file: buffer,
      filename: file.name,
      title: typeof title === "string" ? title : undefined,
      author: typeof author === "string" ? author : undefined,
      ownerId,
    })
    return Response.json(result, { status: 201 })
  } catch (err) {
    if (err instanceof UnsupportedFormatError) {
      return Response.json({ error: err.message }, { status: 400 })
    }
    const message = err instanceof Error ? err.message : "Error desconocido"
    const status = /no está configurada|OPENROUTER_API_KEY/.test(message)
      ? 503
      : 500
    return Response.json({ error: `Ingesta fallida: ${message}` }, { status })
  }
}
