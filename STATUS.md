# STATUS — DeepBooks

> Single source of truth for where this project stands. Last updated: 2026-10-06.
> Read this before starting work. Update it in the same PR when reality changes.

## Done
- 2026-09-26 — Reform COMPLETE (Fases 0–4), all pushed (`main` @ `d4e9cea`). Fase 0: brand unified, social removed, mocks deleted. Fase 1: Supabase schema (books/sections/chunks+pgvector/pautas/momentos/marketplace_listings) + ingestion pipeline (PDF/EPUB/DOCX/TXT/MD → sections → chunks → OpenRouter embeddings) + real library/reader. Fase 2: pautas editor (`/write`), on-demand generation with RAG (`POST /api/generate`, `match_chunks` RPC), per-book Momentos gallery. Fase 3: ambient moments engine (idle/boundary triggers, intensity off/suave/activo, server-side cooldowns). Fase 4: marketplace (`/mercado`, publish/unpublish/acquire — FREE exchange in MVP, device-id ownership instead of auth).
- 2026-09-26 — Verified: 99/99 vitest, tsc clean, prod build green WITHOUT env vars.
- 2026-09-27 — README written (was missing); description typo fixed ('Inmersive' → 'Immersive'); repo pinned on Roger's profile.

## In progress / blocked
- Blocked on Roger: Supabase project, apply migrations 001→003, env vars, then live-test.
- Live Supabase/OpenRouter paths are implemented but NEVER exercised (no credentials) — verify before claiming they work.

## Next
- Live test, then iterate on generation quality and the ambient engine feel.
