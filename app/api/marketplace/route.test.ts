import { describe, it, expect, beforeEach } from "vitest"
import { GET, POST } from "./route"

const URL = "http://localhost/api/marketplace"

function post(body: unknown) {
  return POST(
    new Request(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  )
}

describe("marketplace API", () => {
  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    delete process.env.SUPABASE_SERVICE_ROLE_KEY
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  })

  it("GET 503 sin Supabase configurado", async () => {
    const res = await GET()
    expect(res.status).toBe(503)
  })

  it("POST 400 con body inválido (la validación va antes del 503)", async () => {
    const res = await post({})
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBeTruthy()
  })

  it("POST 400 con precio inválido", async () => {
    const res = await post({ bookId: "b1", priceCents: -5 })
    expect(res.status).toBe(400)
  })

  it("POST 503 con body válido pero sin Supabase", async () => {
    const res = await post({ bookId: "b1", description: "hola" })
    expect(res.status).toBe(503)
  })
})
