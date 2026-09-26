"use client"

import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"

let browserClient: SupabaseClient | null = null

/**
 * Cliente Supabase para componentes cliente. Inicialización perezosa:
 * no lanza en build time si faltan las env vars — devuelve null y la UI
 * muestra un estado honesto ("Supabase no configurado").
 */
export function getBrowserClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) return null
  if (!browserClient) {
    browserClient = createBrowserClient(url, anonKey)
  }
  return browserClient
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  )
}
