# DeepBooks

**New creative ways to experience books.** An immersive reading platform: ingest real books, read them in a normalized reader, generate AI *momentos* grounded in the text via RAG, and let ambient moments surface while you read.

## What it is / what it is not

- Real books in (PDF, EPUB, DOCX, TXT, Markdown) → normalized library + reader. Honest book info — no fabricated metadata.
- AI *momentos* and *pautas* are always **grounded in the book text via RAG** — the model never freelances from nothing.
- The marketplace is **free exchange in the MVP** — no real payments; ownership by device id instead of auth.
- Not a social reading network; not an ebook store.

## Features

- **Real library** — the ingestion pipeline normalizes uploads into sections, splits them into chunks, and embeds them with pgvector for semantic search.
- **Real reader** — normalized sections, progress tracking.
- **Pautas** — per-book writing prompts: continuations, expansions, variations on demand (`POST /api/generate`, `match_chunks` RPC).
- **Momentos** — per-book gallery of AI-generated reading moments: scenes, reflections, artifacts born from the text.
- **Ambient engine** — optional ambient moments triggered by idle time and chapter boundaries; intensity off/suave/activo with server-side cooldowns.
- **Mercado** — publish, unpublish, acquire books (`/mercado`).

## Status

- **Reform complete, Fases 0–4 (2026-09-26, `main` @ `d4e9cea`):** brand unification; real ingestion + reader; pautas + RAG generation; ambient engine; marketplace.
- **Verified:** 99/99 vitest, `tsc` clean, production build green **without env vars**.
- **Blocked on setup:** Supabase project, apply migrations 001→003, env vars — then live-test. The Supabase/OpenRouter paths are implemented but **never exercised** (no credentials yet).

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS · Supabase (Postgres + pgvector + RLS) · OpenRouter (embeddings + generation) · Vitest

## Setup

1. Create a Supabase project and apply the migrations in order:
   `supabase/migrations/001_init.sql` → `002_match_chunks.sql` → `003_ambient.sql`
2. Set the environment variables:
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`, `OPENROUTER_API_KEY`,
   `OPENROUTER_MODEL`, `OPENROUTER_EMBEDDING_MODEL`
3. `npm install && npm run dev`

The app builds and runs without env vars; the Supabase/OpenRouter paths activate once configured.

## Structure

```
deepbooks/
├── app/            # routes: library, reader, /write (pautas), /mercado, /api/*
├── components/     # UI components
├── lib/            # ingestion, RAG, ambient engine
└── supabase/       # migrations 001–003
```

## License

No license file yet.
