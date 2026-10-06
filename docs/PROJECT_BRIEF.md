# DeepBooks — Project Brief

> Full project context in one file. Hand this to ANOTHER AI (GPT, etc.) for planning
> and ideation, then bring the refined specs back. Keep this file accurate — it is the handoff doc.
> For the current timeline see `STATUS.md`. For how to work in this repo see `AGENTS.md`.

## One-liner
DeepBooks is Roger's immersive reading platform: real books, AI-generated momentos, ambient reading experiences.

## Problem & audience
Reading apps are static; AI can make books experiential — generated momentos, ambient reactions to your reading — but nobody packages it as a reading-first product.

## Product (what it is / is not)
'Nuevas formas creativas de experimentar los libros.' Real books in, AI-generated momentos out: pautas editor, RAG generation, per-book Momentos gallery, ambient moments engine, and a marketplace for exchanging momentos (free in MVP). The reform's goal: showcase Roger's GenAI skills to hires/partners.

## Key decisions (locked)
- Public repo (SRogDev/DeepBooks).
- Ingestion: PDF/EPUB/DOCX/TXT/MD → sections → chunks → OpenRouter embeddings; retrieval via `match_chunks` RPC.
- Marketplace = FREE exchange in MVP — no real payments; device-id ownership instead of auth.
- Ambient engine: idle/boundary triggers, intensity off/suave/activo, server-side cooldowns.
- Prod build must stay green without env vars.

## Stack
Next.js, Supabase (Postgres + pgvector) + RLS, OpenRouter (embeddings + generation), Supermemory.

## Business model
Showcase project (hiring/partners). Monetization not in MVP.

## Open questions
- Live Supabase + OpenRouter verification (blocked on Roger).
- What makes a 'momento' feel magical vs gimmicky — needs real reading sessions.
