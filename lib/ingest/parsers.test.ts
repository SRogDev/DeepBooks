import { describe, it, expect } from "vitest"
import JSZip from "jszip"
import {
  parseDocument,
  parseEpub,
  parseDocx,
  parsePdf,
  parseTxt,
  extOf,
  UnsupportedFormatError,
} from "./parsers"

/** Minimal EPUB 3 built in-memory: container + OPF + 2 spine items. */
async function buildEpub(): Promise<Buffer> {
  const zip = new JSZip()
  zip.file("mimetype", "application/epub+zip")
  zip.file(
    "META-INF/container.xml",
    `<?xml version="1.0" encoding="UTF-8"?>` +
      `<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">` +
      `<rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>` +
      `</rootfiles></container>`,
  )
  zip.file(
    "OEBPS/content.opf",
    `<?xml version="1.0" encoding="UTF-8"?>` +
      `<package xmlns="http://www.idpf.org/2007/opf" version="3.0">` +
      `<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">` +
      `<dc:title>Libro de Prueba</dc:title><dc:creator>Autora Test</dc:creator>` +
      `</metadata><manifest>` +
      `<item id="ch1" href="ch1.xhtml" media-type="application/xhtml+xml"/>` +
      `<item id="ch2" href="ch2.xhtml" media-type="application/xhtml+xml"/>` +
      `</manifest><spine><itemref idref="ch1"/><itemref idref="ch2"/></spine></package>`,
  )
  const xhtml = (title: string, body: string) =>
    `<html xmlns="http://www.w3.org/1999/xhtml"><head><title>${title}</title></head>` +
    `<body><h1>${title}</h1><p>${body}</p></body></html>`
  zip.file("OEBPS/ch1.xhtml", xhtml("Primer Capítulo", "Texto del primer capítulo."))
  zip.file("OEBPS/ch2.xhtml", xhtml("Segundo Capítulo", "Texto del segundo capítulo."))
  return zip.generateAsync({ type: "nodebuffer" })
}

/** Minimal DOCX: [Content_Types] + word/document.xml */
async function buildDocx(): Promise<Buffer> {
  const zip = new JSZip()
  zip.file(
    "[Content_Types].xml",
    `<?xml version="1.0" encoding="UTF-8"?>` +
      `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">` +
      `<Override PartName="/word/document.xml" ` +
      `ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>` +
      `</Types>`,
  )
  zip.file(
    "word/document.xml",
    `<?xml version="1.0" encoding="UTF-8"?>` +
      `<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>` +
      `<w:p><w:r><w:t>Hola mundo DOCX</w:t></w:r></w:p>` +
      `<w:p><w:r><w:t>Segundo párrafo del documento.</w:t></w:r></w:p>` +
      `</w:body></w:document>`,
  )
  return zip.generateAsync({ type: "nodebuffer" })
}

/** Minimal valid PDF with computed xref offsets. */
function buildPdf(lines: string[]): Buffer {
  const content = lines
    .map((t, i) => `BT /F1 18 Tf 72 ${720 - i * 28} Td (${t}) Tj ET`)
    .join("\n")
  const objs = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ]
  let pdf = "%PDF-1.4\n"
  const offsets: number[] = []
  objs.forEach((body, i) => {
    offsets[i + 1] = pdf.length
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`
  })
  const xrefPos = pdf.length
  pdf += "xref\n0 6\n0000000000 65535 f \n"
  for (let i = 1; i <= 5; i++) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`
  }
  pdf += `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`
  return Buffer.from(pdf, "latin1")
}

describe("extOf", () => {
  it("maps known extensions", () => {
    expect(extOf("libro.pdf")).toBe("pdf")
    expect(extOf("libro.EPUB")).toBe("epub")
    expect(extOf("doc.docx")).toBe("docx")
    expect(extOf("notas.txt")).toBe("txt")
    expect(extOf("notas.md")).toBe("md")
  })

  it("returns null for unknown extensions", () => {
    expect(extOf("foto.png")).toBeNull()
    expect(extOf("sin-extension")).toBeNull()
  })
})

describe("parseTxt", () => {
  it("returns the text with detected sections", () => {
    const doc = parseTxt(Buffer.from("# Título\n\nContenido aquí.", "utf-8"))
    expect(doc.sections.length).toBe(1)
    expect(doc.sections[0].title).toBe("Título")
    expect(doc.sections[0].text).toContain("Contenido aquí.")
  })
})

describe("parseEpub", () => {
  it("extracts spine items in order with h1 titles and metadata", async () => {
    const doc = await parseEpub(await buildEpub())
    expect(doc.title).toBe("Libro de Prueba")
    expect(doc.sections.length).toBe(2)
    expect(doc.sections[0].title).toBe("Primer Capítulo")
    expect(doc.sections[0].text).toContain("Texto del primer capítulo.")
    expect(doc.sections[1].title).toBe("Segundo Capítulo")
  })

  it("throws on invalid epub", async () => {
    await expect(parseEpub(Buffer.from("no es un zip"))).rejects.toThrow()
  })
})

describe("parseDocx", () => {
  it("extracts raw text from word/document.xml", async () => {
    const doc = await parseDocx(await buildDocx())
    expect(doc.sections.length).toBeGreaterThan(0)
    const all = doc.sections.map((s) => s.text).join("\n")
    expect(all).toContain("Hola mundo DOCX")
    expect(all).toContain("Segundo párrafo del documento.")
  })
})

describe("parsePdf", () => {
  it("extracts text from a minimal PDF", async () => {
    const doc = await parsePdf(buildPdf(["Hola mundo PDF", "Segunda línea"]))
    const all = doc.sections.map((s) => s.text).join("\n")
    expect(all).toContain("Hola mundo PDF")
    expect(all).toContain("Segunda línea")
  })
})

describe("parseDocument", () => {
  it("dispatches by extension", async () => {
    const txt = await parseDocument(Buffer.from("hola", "utf-8"), "notas.txt")
    expect(txt.sections[0].text).toContain("hola")
    const md = await parseDocument(Buffer.from("hola", "utf-8"), "notas.md")
    expect(md.sections[0].text).toContain("hola")
    const epub = await parseDocument(await buildEpub(), "libro.epub")
    expect(epub.sections.length).toBe(2)
  })

  it("throws UnsupportedFormatError for unknown extensions", async () => {
    await expect(
      parseDocument(Buffer.from("x"), "foto.png"),
    ).rejects.toBeInstanceOf(UnsupportedFormatError)
  })
})
