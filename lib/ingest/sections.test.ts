import { describe, it, expect } from "vitest"
import { detectSections } from "./sections"

describe("detectSections", () => {
  it("splits on markdown headings", () => {
    const text = "# Capítulo uno\nTexto uno.\n\n## Subsección\nTexto dos."
    const sections = detectSections(text)
    expect(sections.map((s) => s.title)).toEqual(["Capítulo uno", "Subsección"])
    expect(sections[0].text).toContain("Texto uno.")
    expect(sections[1].text).toContain("Texto dos.")
  })

  it("detects 'Capítulo N' lines as headings", () => {
    const text = "Prólogo breve.\n\nCapítulo 3\nHabía una vez."
    const sections = detectSections(text)
    expect(sections.length).toBe(2)
    expect(sections[0].title).toBe("Inicio")
    expect(sections[1].title).toBe("Capítulo 3")
    expect(sections[1].text).toContain("Había una vez.")
  })

  it("detects ALL-CAPS short lines as headings", () => {
    const text = "EL COMIENZO\nTodo empezó así.\n\nEL FINAL\nY así terminó."
    const sections = detectSections(text)
    expect(sections.map((s) => s.title)).toEqual(["EL COMIENZO", "EL FINAL"])
  })

  it("does not treat long ALL-CAPS paragraphs as headings", () => {
    const longCaps = "ESTE ES UN PÁRRAFO LARGO EN MAYÚSCULAS QUE SUPERA LOS OCHENTA CARACTERES Y NO DEBERÍA SER TÍTULO. ".repeat(3)
    const sections = detectSections(longCaps)
    expect(sections.length).toBe(1)
    expect(sections[0].title).toMatch(/Sección 1/)
  })

  it("falls back to fixed-size sections when there are no headings", () => {
    const text = "palabra ".repeat(2000) // ~14000 chars
    const sections = detectSections(text)
    expect(sections.length).toBeGreaterThanOrEqual(3)
    for (const s of sections) {
      expect(s.text.length).toBeLessThanOrEqual(4200)
    }
    expect(sections[0].title).toBe("Sección 1")
  })

  it("keeps a short prologue before the first heading as 'Inicio'", () => {
    const text = "Nota del autor: disfruta.\n\n# Uno\nContenido."
    const sections = detectSections(text)
    expect(sections[0].title).toBe("Inicio")
    expect(sections[0].text).toContain("Nota del autor")
  })

  it("returns a single section for tiny texts", () => {
    const sections = detectSections("Hola.")
    expect(sections.length).toBe(1)
    expect(sections[0].text).toBe("Hola.")
  })
})
