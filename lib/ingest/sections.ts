import type { DocSection } from "./types"

/** Tamaño de sección cuando no se detectan encabezados. */
const FIXED_SECTION_CHARS = 4000

/**
 * Detecta secciones (capítulos) en texto plano con heurísticas, en orden:
 *  1. Encabezados markdown (`# …`)
 *  2. Líneas tipo "Capítulo 3" / "Chapter 2" / "Parte II" (≤100 chars)
 *  3. Líneas cortas (4–80 chars) totalmente en MAYÚSCULAS
 * El texto previo al primer encabezado forma la sección "Inicio".
 * Sin encabezados: secciones de ~4000 chars cortadas por párrafos,
 * tituladas "Sección N".
 */
export function detectSections(text: string): DocSection[] {
  const clean = text.replace(/\r\n?/g, "\n").trim()
  if (!clean) return []
  const lines = clean.split("\n")

  interface Heading {
    lineIdx: number
    title: string
  }
  const headings: Heading[] = []
  lines.forEach((raw, i) => {
    const line = raw.trim()
    if (!line) return
    const md = /^#{1,4}\s+(.+?)\s*$/.exec(line)
    if (md) {
      headings.push({ lineIdx: i, title: md[1] })
      return
    }
    if (
      /^(cap[ií]tulo|chapter|parte|part)\s+[\d\w]+/i.test(line) &&
      line.length <= 100
    ) {
      headings.push({ lineIdx: i, title: line })
      return
    }
    if (
      line.length >= 4 &&
      line.length <= 80 &&
      /[A-ZÁÉÍÓÚÑ]/.test(line) &&
      !/[a-záéíóúñ]/.test(line)
    ) {
      headings.push({ lineIdx: i, title: line })
    }
  })

  if (headings.length === 0) return fixedSections(clean)

  const sections: DocSection[] = []
  const prologue = lines.slice(0, headings[0].lineIdx).join("\n").trim()
  if (prologue) sections.push({ title: "Inicio", text: prologue })

  headings.forEach((h, k) => {
    const nextIdx =
      k + 1 < headings.length ? headings[k + 1].lineIdx : lines.length
    const body = lines
      .slice(h.lineIdx + 1, nextIdx)
      .join("\n")
      .trim()
    sections.push({ title: h.title, text: body })
  })
  return sections.filter((s) => s.text.length > 0)
}

function fixedSections(clean: string): DocSection[] {
  const sections: DocSection[] = []
  const paras = clean.split(/\n{2,}/)
  let current = ""
  let n = 1
  const flush = () => {
    if (current.trim()) {
      sections.push({ title: `Sección ${n++}`, text: current.trim() })
      current = ""
    }
  }
  for (const para of paras) {
    if (!para.trim()) continue
    if (current && `${current}\n\n${para}`.length > FIXED_SECTION_CHARS) {
      flush()
    }
    current = current ? `${current}\n\n${para}` : para
    while (current.length > FIXED_SECTION_CHARS) {
      sections.push({
        title: `Sección ${n++}`,
        text: current.slice(0, FIXED_SECTION_CHARS),
      })
      current = current.slice(FIXED_SECTION_CHARS)
    }
  }
  flush()
  return sections.length > 0 ? sections : [{ title: "Sección 1", text: clean }]
}
