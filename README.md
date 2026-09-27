# DeepBooks

**New creative ways to experience books.** An immersive reading platform: ingest real books, read them in a normalized reader, generate AI *momentos* grounded in the text via RAG, and let ambient moments surface while you read.

## Features

- **Real library** — Upload PDF, EPUB, DOCX, TXT, or Markdown. The ingestion pipeline normalizes them into sections, splits them into chunks, and embeds them with pgvector for semantic search.
- **Real reader** — Normalized sections, honest book info (no fabricated metadata), progress tracking.
- **Pautas** — Per-book writing prompts. Generate continuations, expansions, and variations on demand, grounded in the book via RAG (`POST /api/generate`, `match_chunks` RPC).
- **Momentos** — A per-book gallery of AI-generated reading moments: scenes, reflections, and artifacts born from the text.
- **Ambient engine** — Optional ambient moments triggered by idle time and chapter boundaries. Intensity selector (off / suave / activo) with server-side cooldowns, so it never spams.
- **Mercado** — A small marketplace to publish, unpublish, and acquire books. Free exchange in the MVP; ownership by device id (no auth yet).

## Stack

Next.js (App Router) · Supabase (Postgres + pgvector + RLS) · OpenRouter (embeddings + generation) · Tailwind CSS · Vitest

## Setup

1. Create a Supabase project and apply the migrations in order:
   `supabase/migrations/001_init.sql` → `002_match_chunks.sql` → `003_ambient.sql`
2. Set the environment variables:
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`, `OPENROUTER_API_KEY`,
   `OPENROUTER_MODEL`, `OPENROUTER_EMBEDDING_MODEL`
3. `npm install && npm run dev`

The app builds and runs without env vars; the Supabase/OpenRouter paths activate once configured.

## Status

Reform complete through phases 0–4: brand unification, real ingestion + reader, pautas + RAG generation, ambient engine, marketplace. 99/99 tests green, `tsc` clean, production build green.
