import JSZip from "jszip"
import mammoth from "mammoth"
import pdfParse from "pdf-parse/lib/pdf-parse.js"
import { detectSections } from "./sections"
import {
  UnsupportedFormatError,
  type DocSection,
  type ParsedDocument,
  type SupportedExt,
} from "./types"

export { UnsupportedFormatError }

/** Extensión soportada de un nombre de archivo, o null. */
export function extOf(filename: string): SupportedExt | null {
  const ext = /\.([a-z0-9]+)$/i.exec(filename.trim())?.[1]?.toLowerCase()
  return ext === "pdf" ||
    ext === "epub" ||
    ext === "docx" ||
    ext === "txt" ||
    ext === "md"
    ? ext
    : null
}

/** TXT/MD: el texto es el documento. */
export function parseTxt(input: Buffer): ParsedDocument {
  const text = input.toString("utf-8").trim()
  if (!text) throw new Error("El documento está vacío")
  return { title: null, author: null, sections: detectSections(text) }
}

/** PDF vía pdf-parse. */
export async function parsePdf(input: Buffer): Promise<ParsedDocument> {
  let text: string
  let info: { Title?: string; Author?: string } | undefined
  try {
    // new Uint8Array(...) copia a un ArrayBuffer limpio: los Buffer de Node
    // pueden vivir en un pool compartido y este pdf.js viejo lee
    // src.buffer directamente (basura del pool en vez del PDF).
    const data = await pdfParse(new Uint8Array(input))
    text = (data.text ?? "").trim()
    info = data.info ?? undefined
  } catch (err) {
    throw new Error(
      `No se pudo leer el PDF: ${err instanceof Error ? err.message : String(err)}`,
    )
  }
  if (!text) throw new Error("El PDF no contiene texto extraíble")
  return {
    title: info?.Title?.trim() || null,
    author: info?.Author?.trim() || null,
    sections: detectSections(text),
  }
}

/**
 * EPUB vía jszip: lee META-INF/container.xml → OPF → spine en orden.
 * El XML se extrae con regex acotadas (suficiente para EPUBs bien formados;
 * documentado como decisión consciente frente a añadir un parser XML).
 */
export async function parseEpub(input: Buffer): Promise<ParsedDocument> {
  let zip: JSZip
  try {
    zip = await JSZip.loadAsync(input)
  } catch {
    throw new Error("EPUB inválido: no es un archivo zip")
  }

  const containerFile = zip.file("META-INF/container.xml")
  if (!containerFile) {
    throw new Error("EPUB inválido: falta META-INF/container.xml")
  }
  const containerXml = await containerFile.async("text")
  const opfPath = /full-path="([^"]+)"/.exec(containerXml)?.[1]
  if (!opfPath) throw new Error("EPUB inválido: container.xml sin rootfile")
  const opfFile = zip.file(opfPath)
  if (!opfFile) throw new Error(`EPUB inválido: no se encontró ${opfPath}`)
  const opf = await opfFile.async("text")
  const baseDir = opfPath.includes("/")
    ? opfPath.slice(0, opfPath.lastIndexOf("/") + 1)
    : ""

  const title =
    /<dc:title[^>]*>([^<]*)<\/dc:title>/.exec(opf)?.[1]?.trim() || null
  const author =
    /<dc:creator[^>]*>([^<]*)<\/dc:creator>/.exec(opf)?.[1]?.trim() || null

  const manifest = new Map<string, string>()
  for (const m of opf.matchAll(/<item\b[^>]*>/g)) {
    const tag = m[0]
    const id = /id="([^"]+)"/.exec(tag)?.[1]
    const href = /href="([^"]+)"/.exec(tag)?.[1]
    const mediaType = /media-type="([^"]+)"/.exec(tag)?.[1] ?? ""
    if (id && href && mediaType.includes("xhtml")) manifest.set(id, href)
  }
  const spine: string[] = [
    ...opf.matchAll(/<itemref\b[^>]*idref="([^"]+)"/g),
  ].map((m) => m[1])

  const sections: DocSection[] = []
  for (const idref of spine) {
    const href = manifest.get(idref)
    if (!href) continue
    const file = zip.file(baseDir + decodeURIComponent(href))
    if (!file) continue
    const { title: secTitle, text } = xhtmlToText(await file.async("text"))
    if (text) sections.push({ title: secTitle, text })
  }
  if (sections.length === 0) {
    throw new Error("El EPUB no contiene texto legible")
  }
  return { title, author, sections }
}

/** DOCX vía mammoth (texto crudo). */
export async function parseDocx(input: Buffer): Promise<ParsedDocument> {
  let value: string
  try {
    const result = await mammoth.extractRawText({ buffer: input })
    value = result.value.trim()
  } catch (err) {
    throw new Error(
      `No se pudo leer el DOCX: ${err instanceof Error ? err.message : String(err)}`,
    )
  }
  if (!value) throw new Error("El DOCX no contiene texto extraíble")
  return { title: null, author: null, sections: detectSections(value) }
}

/** Despacha al parser según la extensión del archivo. */
export async function parseDocument(
  input: Buffer,
  filename: string,
): Promise<ParsedDocument> {
  switch (extOf(filename)) {
    case "pdf":
      return parsePdf(input)
    case "epub":
      return parseEpub(input)
    case "docx":
      return parseDocx(input)
    case "txt":
    case "md":
      return parseTxt(input)
    default:
      throw new UnsupportedFormatError(filename)
  }
}

function xhtmlToText(xhtml: string): { title: string | null; text: string } {
  const h1 = /<h1[^>]*>([\s\S]*?)<\/h1>/i.exec(xhtml)?.[1]
  const docTitle = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(xhtml)?.[1]
  const rawTitle = (h1 ?? docTitle ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()

  let body = xhtml.replace(/<head[\s\S]*?<\/head>/gi, " ")
  body = body
    .replace(/<\/(p|h1|h2|h3|h4|div|li|tr|blockquote|section|article)>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
  const text = decodeEntities(body)
    .split("\n")
    .map((l) => l.replace(/[ \t]+/g, " ").trim())
    .filter(Boolean)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
  return { title: rawTitle || null, text }
}

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}
