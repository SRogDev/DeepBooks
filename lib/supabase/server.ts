import { createClient, type SupabaseClient } from "@supabase/supabase-js"

/**
 * Cliente Supabase para route handlers / server components.
 * Usa la service-role key cuando existe (ingesta), si no la anon key.
 * Inicialización perezosa: importar este módulo nunca lanza; si faltan
 * las env vars devuelve null y la ruta responde 503 con mensaje claro.
 */
export function getServerClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export function missingSupabaseResponse() {
  return Response.json(
    {
      error:
        "Supabase no está configurado. Define NEXT_PUBLIC_SUPABASE_URL y " +
        "SUPABASE_SERVICE_ROLE_KEY (o NEXT_PUBLIC_SUPABASE_ANON_KEY) y aplica " +
        "supabase/migrations/001_init.sql en tu proyecto.",
    },
    { status: 503 },
  )
}
