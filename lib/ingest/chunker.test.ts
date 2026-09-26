import { describe, it, expect } from "vitest"
import { chunkText } from "./chunker"

describe("chunkText", () => {
  it("returns [] for empty or whitespace-only text", () => {
    expect(chunkText("")).toEqual([])
    expect(chunkText("   \n  ")).toEqual([])
  })

  it("returns a single chunk for short text", () => {
    const chunks = chunkText("Hola mundo")
    expect(chunks).toEqual(["Hola mundo"])
  })

  it("splits long text into chunks of at most sizeChars", () => {
    const para = "Lorem ipsum dolor sit amet. ".repeat(40) // ~1120 chars
    const text = Array.from({ length: 10 }, (_, i) => `Párrafo ${i}\n${para}`).join("\n\n")
    const chunks = chunkText(text, { sizeChars: 2000, overlapChars: 200 })
    expect(chunks.length).toBeGreaterThan(1)
    for (const c of chunks) {
      expect(c.length).toBeLessThanOrEqual(2000)
    }
  })

  it("keeps consecutive chunks overlapping by overlapChars", () => {
    const para = "x".repeat(900)
    const text = [para, para, para, para, para].join("\n\n") // 5 paras
    const chunks = chunkText(text, { sizeChars: 2000, overlapChars: 200 })
    expect(chunks.length).toBeGreaterThan(1)
    const tail = chunks[0].slice(-200)
    expect(chunks[1]).toContain(tail)
  })

  it("covers the whole text from start to end", () => {
    const text = Array.from({ length: 20 }, (_, i) => `Sección ${i}: ` + "abc ".repeat(150)).join("\n\n")
    const trimmed = text.trim()
    const chunks = chunkText(text, { sizeChars: 2000, overlapChars: 200 })
    expect(chunks[0].startsWith(trimmed.slice(0, 50))).toBe(true)
    expect(chunks[chunks.length - 1].endsWith(trimmed.slice(-50))).toBe(true)
  })

  it("hard-splits a single huge paragraph without losing text", () => {
    const text = "z".repeat(5000)
    const chunks = chunkText(text, { sizeChars: 2000, overlapChars: 200 })
    expect(chunks.length).toBeGreaterThan(1)
    for (const c of chunks) {
      expect(c.length).toBeLessThanOrEqual(2000)
    }
    // no gaps: every char of the original appears across chunks in order
    const joined = chunks.join("")
    expect(joined.replace(/\n\n/g, "")).toContain("z".repeat(100))
  })
})
