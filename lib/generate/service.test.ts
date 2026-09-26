import { describe, it, expect, vi } from "vitest"
import {
  generateOnDemand,
  NotFoundError,
  type GenerateServiceDeps,
} from "./service"
import type { ContextChunk } from "./engine"

function makeDeps(overrides: Partial<GenerateServiceDeps> = {}) {
  const deps: GenerateServiceDeps = {
    loadContext: vi.fn(async () => ({
      bookId: "book-1",
      title: "Moby Dick",
      author: "Herman Melville",
      pautas: "Tono poético.",
      anchor: {
        id: "sec-1",
        idx: 0,
        title: "Inicio",
        text: "Llamadme Ismael.",
      },
    })),
    embedQuery: vi.fn(async () => [0.1, 0.2]),
    findChunks: vi.fn(async () => [
      { text: "El mar estaba en calma.", sectionIdx: 0, sectionTitle: "Inicio" },
    ] as ContextChunk[]),
    chat: vi.fn(async () => "Texto generado."),
    saveMomento: vi.fn(async () => "mom-1"),
    ...overrides,
  }
  return deps
}

describe("generateOnDemand", () => {
  it("orquesta embed → RAG → chat → guardado y devuelve el momento", async () => {
    const deps = makeDeps()
    const result = await generateOnDemand(
      { bookId: "book-1", sectionId: "sec-1", prompt: "Visualiza esta escena" },
      deps,
    )

    expect(result).toEqual({ momentoId: "mom-1", text: "Texto generado." })
    expect(deps.embedQuery).toHaveBeenCalledWith("Visualiza esta escena")
    expect(deps.findChunks).toHaveBeenCalledWith("book-1", [0.1, 0.2], 6)

    // El system prompt lleva las pautas y el título del libro
    const chat = deps.chat as ReturnType<typeof vi.fn>
    const [system, user] = chat.mock.calls[0] as [string, string]
    expect(system).toContain("Tono poético.")
    expect(system).toContain("Moby Dick")
    expect(user).toContain("Llamadme Ismael")
    expect(user).toContain("El mar estaba en calma.")
    expect(user).toContain("Visualiza esta escena")

    // El momento se guarda con prompt, texto y ancla
    const save = deps.saveMomento as ReturnType<typeof vi.fn>
    expect(save).toHaveBeenCalledWith({
      bookId: "book-1",
      prompt: "Visualiza esta escena",
      text: "Texto generado.",
      sectionId: "sec-1",
    })
  })

  it("funciona sin sección ancla", async () => {
    const deps = makeDeps()
    const result = await generateOnDemand(
      { bookId: "book-1", prompt: "Resume el libro" },
      deps,
    )
    expect(result.momentoId).toBe("mom-1")
    const save = deps.saveMomento as ReturnType<typeof vi.fn>
    expect(save.mock.calls[0][0].sectionId).toBeUndefined()
  })

  it("lanza NotFoundError si el libro no existe", async () => {
    const deps = makeDeps({ loadContext: vi.fn(async () => null) })
    await expect(
      generateOnDemand({ bookId: "nope", prompt: "hola" }, deps),
    ).rejects.toBeInstanceOf(NotFoundError)
  })

  it("propaga el error del chat sin guardar el momento", async () => {
    const deps = makeDeps({
      chat: vi.fn(async () => {
        throw new Error("OpenRouter chat falló (429)")
      }),
    })
    await expect(
      generateOnDemand({ bookId: "book-1", prompt: "hola" }, deps),
    ).rejects.toThrow("429")
    expect(deps.saveMomento).not.toHaveBeenCalled()
  })
})
