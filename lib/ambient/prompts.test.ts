import { describe, it, expect } from "vitest"
import {
  AMBIENT_PROMPT_BANK,
  pickAmbientPrompt,
  type AmbientPromptItem,
} from "./prompts"
import type { MomentoKind } from "@/lib/supabase/db-types"

const VALID_KINDS: MomentoKind[] = [
  "text",
  "image",
  "audio",
  "branch",
  "question",
]

describe("AMBIENT_PROMPT_BANK", () => {
  it("tiene prompts creativos en español, todos válidos", () => {
    expect(AMBIENT_PROMPT_BANK.length).toBeGreaterThanOrEqual(4)
    for (const item of AMBIENT_PROMPT_BANK) {
      expect(VALID_KINDS).toContain(item.kind)
      expect(item.label.trim().length).toBeGreaterThan(0)
      expect(item.prompt.trim().length).toBeGreaterThan(20)
    }
  })

  it("cubre al menos escena alternativa, reflexión y detalle sensorial", () => {
    const labels = AMBIENT_PROMPT_BANK.map((i) =>
      i.label.toLowerCase(),
    ).join(" | ")
    expect(labels).toMatch(/escena|alternativa/)
    expect(labels).toMatch(/reflex/)
    expect(labels).toMatch(/sensorial/)
  })
})

describe("pickAmbientPrompt", () => {
  it("elige determinísticamente con random inyectado", () => {
    const first: AmbientPromptItem = pickAmbientPrompt(() => 0)
    expect(first).toBe(AMBIENT_PROMPT_BANK[0])

    const last: AmbientPromptItem = pickAmbientPrompt(() => 0.9999)
    expect(last).toBe(AMBIENT_PROMPT_BANK[AMBIENT_PROMPT_BANK.length - 1])
  })

  it("con random real devuelve un item del bank", () => {
    const item = pickAmbientPrompt()
    expect(AMBIENT_PROMPT_BANK).toContain(item)
  })
})
