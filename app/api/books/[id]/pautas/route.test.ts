import { describe, it, expect, beforeEach } from "vitest"
import { GET, PATCH } from "./route"

const ID = "book-1"
const URL = `http://localhost/api/books/${ID}/pautas`

function patch(body: unknown) {
  return PATCH(
    new Request(URL, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
    { params: Promise.resolve({ id: ID }) },
  )
}

describe("pautas API", () => {
  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    delete process.env.SUPABASE_SERVICE_ROLE_KEY
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  })

  it("GET 503 sin Supabase configurado", async () => {
    const res = await GET(new Request(URL), {
      params: Promise.resolve({ id: ID }),
    })
    expect(res.status).toBe(503)
  })

  it("PATCH 503 sin Supabase configurado", async () => {
    const res = await patch({ content: "Nuevas pautas" })
    expect(res.status).toBe(503)
  })

  it("PATCH 400 con contenido vacío", async () => {
    // Sin env no llegaría a validar; la validación ocurre antes del 503
    // solo si el orden es: validar cuerpo → 400, luego env → 503.
    // Este test documenta el orden elegido: primero el cuerpo.
    const res = await patch({ content: "   " })
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBeTruthy()
  })

  it("PATCH 400 con contenido demasiado largo", async () => {
    const res = await patch({ content: "x".repeat(4001) })
    expect(res.status).toBe(400)
  })

  it("PATCH 400 sin content", async () => {
    const res = await patch({})
    expect(res.status).toBe(400)
  })
})
