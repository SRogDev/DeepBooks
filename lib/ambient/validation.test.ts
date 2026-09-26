import { describe, it, expect } from "vitest"
import { validateAmbientBody, validateIntensityBody } from "./validation"

describe("validateAmbientBody", () => {
  it("acepta bookId con sectionId opcional", () => {
    expect(
      validateAmbientBody({ bookId: "book-1", sectionId: "sec-1" }),
    ).toEqual({
      ok: true,
      value: { bookId: "book-1", sectionId: "sec-1" },
    })
    expect(validateAmbientBody({ bookId: "book-1" })).toEqual({
      ok: true,
      value: { bookId: "book-1", sectionId: undefined },
    })
  })

  it("rechaza cuerpos inválidos", () => {
    expect(validateAmbientBody(null).ok).toBe(false)
    expect(validateAmbientBody({}).ok).toBe(false)
    expect(validateAmbientBody({ bookId: "  " }).ok).toBe(false)
    expect(
      validateAmbientBody({ bookId: "book-1", sectionId: 42 }).ok,
    ).toBe(false)
  })
})

describe("validateIntensityBody", () => {
  it("acepta off | suave | activo", () => {
    for (const v of ["off", "suave", "activo"] as const) {
      expect(validateIntensityBody({ ambient_intensity: v })).toEqual({
        ok: true,
        value: { ambient_intensity: v },
      })
    }
  })

  it("rechaza valores fuera del enum", () => {
    expect(validateIntensityBody(null).ok).toBe(false)
    expect(validateIntensityBody({}).ok).toBe(false)
    expect(validateIntensityBody({ ambient_intensity: "mucho" }).ok).toBe(
      false,
    )
    expect(validateIntensityBody({ ambient_intensity: 3 }).ok).toBe(false)
  })
})
