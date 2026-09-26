import { describe, it, expect } from "vitest"
import { resolveDeviceId } from "./identity"

describe("resolveDeviceId", () => {
  it("devuelve el id cuando el header trae un valor", () => {
    expect(resolveDeviceId("abc-123")).toBe("abc-123")
  })

  it("recorta espacios", () => {
    expect(resolveDeviceId("  abc-123  ")).toBe("abc-123")
  })

  it("devuelve null con header vacío o ausente", () => {
    expect(resolveDeviceId(null)).toBeNull()
    expect(resolveDeviceId("")).toBeNull()
    expect(resolveDeviceId("   ")).toBeNull()
  })
})
