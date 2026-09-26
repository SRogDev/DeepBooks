import { describe, it, expect, beforeEach } from "vitest"
import { GET } from "./route"

const URL = "http://localhost/api/books/book-1/momentos"

describe("GET /api/books/[id]/momentos", () => {
  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    delete process.env.SUPABASE_SERVICE_ROLE_KEY
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  })

  it("503 sin Supabase configurado", async () => {
    const res = await GET(new Request(URL), {
      params: Promise.resolve({ id: "book-1" }),
    })
    expect(res.status).toBe(503)
    const json = await res.json()
    expect(json.error).toBeTruthy()
  })
})
