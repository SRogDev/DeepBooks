import { describe, it, expect, beforeEach } from "vitest"
import { POST } from "./route"

function post(body: unknown) {
  return POST(new Request("http://localhost/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }))
}

describe("POST /api/generate", () => {
  beforeEach(() => {
    delete process.env.OPENROUTER_API_KEY
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    delete process.env.SUPABASE_SERVICE_ROLE_KEY
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  })

  it("400 cuando el cuerpo es inválido", async () => {
    const res = await post({ prompt: "   " })
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBeTruthy()
  })

  it("400 cuando falta bookId", async () => {
    const res = await post({ prompt: "hola" })
    expect(res.status).toBe(400)
  })

  it("503 cuando falta OPENROUTER_API_KEY (antes de tocar Supabase)", async () => {
    const res = await post({ bookId: "b", prompt: "Visualiza esta escena" })
    expect(res.status).toBe(503)
    const json = await res.json()
    expect(json.error).toContain("OPENROUTER_API_KEY")
  })
})
