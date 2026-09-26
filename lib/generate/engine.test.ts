import { describe, it, expect } from "vitest"
import {
  buildSystemPrompt,
  buildUserMessage,
  chatCompletion,
  resolveChatModel,
  validateGenerateBody,
  type AnchorSection,
  type ContextChunk,
} from "./engine"

const anchor: AnchorSection = {
  id: "sec-1",
  idx: 2,
  title: "El mar",
  text: "El mar rugía contra los acantilados. ".repeat(500), // > 4000 chars
}

const chunks: ContextChunk[] = [
  { text: "Las olas golpeaban la orilla.", sectionIdx: 1, sectionTitle: "La llegada" },
  { text: "Nadie recordaba la tormenta.", sectionIdx: 2, sectionTitle: null },
]

describe("buildSystemPrompt", () => {
  it("incluye pautas, título, autor y la regla anti-spoiler", () => {
    const sys = buildSystemPrompt(
      "Tono poético, nunca expliques el final.",
      "Moby Dick",
      "Herman Melville",
    )
    expect(sys).toContain("Tono poético, nunca expliques el final.")
    expect(sys).toContain("Moby Dick")
    expect(sys).toContain("Herman Melville")
    expect(sys).toContain("No reveles giros futuros")
  })

  it("omite el autor cuando es null", () => {
    const sys = buildSystemPrompt("Pautas.", "Libro X", null)
    expect(sys).toContain("Libro X")
    expect(sys).not.toContain(" de null")
  })

  it("ancla la generación al texto del libro", () => {
    const sys = buildSystemPrompt("Pautas.", "Libro X", null)
    expect(sys).toContain("anclado en el texto del libro")
  })
})

describe("buildUserMessage", () => {
  it("incluye el ancla (truncada a 4000), los chunks y la petición", () => {
    const msg = buildUserMessage("Explícame esta parte", anchor, chunks)
    expect(msg).toContain('sección 3 ("El mar")')
    expect(msg).toContain("Fragmentos relevantes del libro")
    expect(msg).toContain("Las olas golpeaban la orilla.")
    expect(msg).toContain('[Sección 2 "La llegada"]')
    expect(msg).toContain("[Sección 3]")
    expect(msg).toContain("Petición del lector: Explícame esta parte")
    // El texto del ancla va truncado: el mensaje no debe contenerla entera
    expect(msg.length).toBeLessThan(anchor.text.length)
  })

  it("funciona sin ancla ni contexto", () => {
    const msg = buildUserMessage("¿Qué pasaría si…?", null, [])
    expect(msg).toContain("Petición del lector: ¿Qué pasaría si…?")
    expect(msg).not.toContain("Fragmentos relevantes")
  })
})

describe("chatCompletion", () => {
  it("devuelve el texto de la primera choice", async () => {
    const fetchImpl = async () =>
      new Response(
        JSON.stringify({ choices: [{ message: { content: "  Hola lector  " } }] }),
        { status: 200 },
      )
    const text = await chatCompletion({
      apiKey: "k",
      model: "m",
      system: "sys",
      user: "usr",
      fetchImpl: fetchImpl as typeof fetch,
    })
    expect(text).toBe("Hola lector")
  })

  it("lanza con el status cuando OpenRouter falla", async () => {
    const fetchImpl = async () => new Response("cuota excedida", { status: 429 })
    await expect(
      chatCompletion({
        apiKey: "k",
        model: "m",
        system: "sys",
        user: "usr",
        fetchImpl: fetchImpl as typeof fetch,
      }),
    ).rejects.toThrow("429")
  })

  it("lanza cuando la respuesta viene vacía", async () => {
    const fetchImpl = async () =>
      new Response(JSON.stringify({ choices: [] }), { status: 200 })
    await expect(
      chatCompletion({
        apiKey: "k",
        model: "m",
        system: "sys",
        user: "usr",
        fetchImpl: fetchImpl as typeof fetch,
      }),
    ).rejects.toThrow("vacía")
  })
})

describe("resolveChatModel", () => {
  it("usa OPENROUTER_MODEL o el valor por defecto", () => {
    const prev = process.env.OPENROUTER_MODEL
    delete process.env.OPENROUTER_MODEL
    expect(resolveChatModel()).toBe("openai/gpt-4o-mini")
    process.env.OPENROUTER_MODEL = "x/y"
    expect(resolveChatModel()).toBe("x/y")
    if (prev === undefined) delete process.env.OPENROUTER_MODEL
    else process.env.OPENROUTER_MODEL = prev
  })
})

describe("validateGenerateBody", () => {
  it("rechaza bookId ausente", () => {
    expect(validateGenerateBody({ prompt: "hola" }).ok).toBe(false)
  })

  it("rechaza prompt vacío o ausente", () => {
    expect(validateGenerateBody({ bookId: "b" }).ok).toBe(false)
    expect(validateGenerateBody({ bookId: "b", prompt: "   " }).ok).toBe(false)
  })

  it("rechaza prompt demasiado largo", () => {
    const r = validateGenerateBody({ bookId: "b", prompt: "x".repeat(2001) })
    expect(r.ok).toBe(false)
  })

  it("acepta un cuerpo válido y recorta el prompt", () => {
    const r = validateGenerateBody({
      bookId: "b",
      sectionId: "s",
      prompt: "  Explícame  ",
    })
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.value).toEqual({ bookId: "b", sectionId: "s", prompt: "Explícame" })
    }
  })

  it("sectionId es opcional", () => {
    const r = validateGenerateBody({ bookId: "b", prompt: "hola" })
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.value.sectionId).toBeUndefined()
  })
})
