import { describe, it, expect } from "vitest"
import { validatePublishBody } from "./validation"

describe("validatePublishBody", () => {
  it("400 sin bookId", () => {
    const r = validatePublishBody({})
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.error).toMatch(/bookId/i)
  })

  it("400 con bookId vacío", () => {
    const r = validatePublishBody({ bookId: "   " })
    expect(r.ok).toBe(false)
  })

  it("400 con priceCents negativo", () => {
    const r = validatePublishBody({ bookId: "b1", priceCents: -100 })
    expect(r.ok).toBe(false)
  })

  it("400 con priceCents no entero", () => {
    const r = validatePublishBody({ bookId: "b1", priceCents: 9.99 })
    expect(r.ok).toBe(false)
  })

  it("400 con priceCents no numérico", () => {
    const r = validatePublishBody({ bookId: "b1", priceCents: "gratis" })
    expect(r.ok).toBe(false)
  })

  it("acepta body mínimo válido", () => {
    const r = validatePublishBody({ bookId: "b1" })
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.value.bookId).toBe("b1")
      expect(r.value.description).toBeNull()
      expect(r.value.priceCents).toBe(0)
    }
  })

  it("acepta descripción y precio sugerido", () => {
    const r = validatePublishBody({
      bookId: "b1",
      description: "Mi edición anotada",
      priceCents: 500,
    })
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.value.description).toBe("Mi edición anotada")
      expect(r.value.priceCents).toBe(500)
    }
  })

  it("recorta la descripción y limita su largo", () => {
    const r = validatePublishBody({ bookId: "b1", description: "x".repeat(2000) })
    expect(r.ok).toBe(false)
  })

  it("400 con body no objeto", () => {
    expect(validatePublishBody(null).ok).toBe(false)
    expect(validatePublishBody("hola").ok).toBe(false)
  })
})
