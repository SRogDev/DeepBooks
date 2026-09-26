# DeepBooks — Reform Plan

> **Product thesis:** DeepBooks sells *creative new ways to experience books*.
> Not another reader. Not another store. A book you can *live*.

**Goal of this project:** a public portfolio piece demonstrating GenAI product
skills to potential hires and partners. Every architectural choice should be
legible as a GenAI capability: document understanding, prompt design, RAG,
agentic behavior, multimodal generation.

**Status:** legacy Next.js frontend, all-mock (zustand + fake data), no backend,
no AI. This plan reforms it into a real product.

---

## 1. What changes (the reform, in Roger's words → buildable shape)

| Old | New |
|---|---|
| Home = marketplace ("Descubre") | **Home = Biblioteca** (your library). Marketplace becomes a small secondary section |
| Upload = epub-only, half-broken | **Add any document**: PDF, EPUB, TXT, MD, DOCX… parsed to text, chunked, embedded |
| "Immersion points" pinned on pages (obsolete) | **Generative experience engine** (see §3) |
| Social network (feed, posts, achievements, challenges) | **Removed from MVP** → behind `FEATURE_SOCIAL` flag, post-MVP |
| Book editor UX confusing | Editor's job is redefined: **write the experience guidelines** (§3.1) |
| Zero AI | AI everywhere reading happens: on-demand, ambient, and curated |

---

## 2. Information architecture (new)

```
/                    → landing (product thesis: new ways to experience books)
/biblioteca          → HOME for logged-in users: your library + "Add document"
/libro/[id]          → book hub: read, experience guidelines, Momentos
/libro/[id]/leer     → the reader (position-aware, generative)
/libro/[id]/momentos → gallery of everything AI generated for this book
/mercado             → small marketplace: books people upload directly
/escribir            → editor: upload doc + write experience guidelines (pautas)
/ajustes             → settings (AI intensity, ambient frequency, language)
```

Legacy routes (`/home`, `/comunidad`, `/profile` social parts, `/gestion`) are
removed or hidden behind `FEATURE_SOCIAL=false`.

---

## 3. The generative experience engine (core of the reform)

Three ways generativity enters reading. All of it grounded in the book's text
via RAG (chunks around the reader's position + book-level summary).

### 3.1 Pautas de experiencia (experience guidelines) — set by the editor

The book's editor/curator writes natural-language directives for *how this book
should be lived*, e.g.:

- "Cada vez que aparezca el mar, genera una visualización cinematográfica."
- "Hazme una pregunta socrática cuando la tensión entre personajes suba."
- "Tono: poético, nunca expliques el final."

These pautas compile into the system prompt of every generation for that book.
**This is the GenAI showcase:** prompt engineering as a product surface —
natural-language direction of model behavior, scoped per book.

Default pautas exist for uploaded docs without an editor ("Modo DeepBooks").

### 3.2 Generación bajo demanda (on-demand, anywhere in the book)

At any reading position, the user can ask for something generative:

- Long-press / select text / floating ✨ button → "¿Qué se te ocurre?"
- Quick actions: *visualiza esta escena* (image), *¿qué siente el personaje?*
  (inner monologue), *¿y si…?* (alternate branch), *sonido ambiente*
  (music prompt), *explícame como si…* (explain), *debate con el autor*
  (dialogue with a persona built from the book).
- Free prompt anchored to current position: the model receives surrounding
  chunks + pautas + conversation memory.

### 3.3 Momentos ambientales (random generative events)

While reading, *sometimes* something generative happens on its own — a
surprise card slides in, based on the book and the pautas:

- A generated visualization of the scene you just read.
- A "what if" fork at a decision point.
- A character's unsent letter, a poem the scene inspires, a question that
  reframes what you read.

Controlled by an **ambient intensity** setting (off / sutil / inmersivo) and a
per-book frequency in the pautas. Never interrupts mid-sentence: triggers on
chapter/section boundaries or idle pauses. This is the "aliveness" of the app —
reading feels accompanied.

### 3.4 Momentos (everything generative, saved)

Every artifact the engine produces — on-demand or ambient — is saved to the
book's **Momentos** section: a gallery/timeline (images, texts, audios,
branches). Shareable as images/cards. This is the user's collection of
*their* version of the book.

---

## 4. Document ingestion (any format)

Upload → parse → normalize:

- **Parsers:** PDF (pdf.js / pdf-parse), EPUB (epub2/zip + XHTML), DOCX
  (mammoth), TXT/MD (direct). "No tiene que ser epub obligado, puede ser
  cualquiera."
- **Pipeline:** extract text → detect chapters/sections → chunk (~500 tokens,
  overlap) → embed → store in Supabase (pgvector).
- Reader renders from normalized sections; position = section id + offset, so
  generation is always anchored to real text.

---

## 5. Tech stack (proposed)

- **Next.js 15** (keep, upgrade what exists) + Tailwind + shadcn (keep).
- **Supabase**: Auth + Postgres + pgvector (book chunks, momentos, pautas) +
  Storage (uploads, generated images).
- **OpenRouter** for all LLM calls (cheap models default; image via
  text-to-image models or pollinations-style fallback — decide in build).
- **Feature flags** via env: `FEATURE_SOCIAL=false` (post-MVP),
  `FEATURE_MARKETPLACE=true`, `FEATURE_AMBIENT=true`.
- Legacy mock stores (`lib/mock-*`, zustand mock data) deleted as real
  backend lands.

Open decisions (need Roger): app language (keep Spanish UI?), brand unify to
**DeepBooks** (repo says DeepBooks, package.json says `prisma-book`, landing
says PrismaBook), image-generation provider.

---

## 6. Data model (Supabase)

```
books        id, owner_id, title, author, source_type(upload|marketplace),
             file_url, cover_url, language, created_at
sections     id, book_id, idx, title, text              -- normalized reading units
chunks       id, book_id, section_id, text, embedding   -- pgvector, RAG
pautas       id, book_id, content, is_default           -- experience guidelines
momentos     id, book_id, user_id, kind(image|text|audio|branch|question),
             prompt, output_ref, anchor_section_id, origin(on_demand|ambient),
             created_at
marketplace_listings  id, book_id, price, description   -- small, secondary
```

---

## 7. MVP phases

- **Fase 0 — Limpieza:** delete social routes/components behind flag, delete
  mock stores, unify brand to DeepBooks, fix broken imports (`write-interface`
  etc.). App compiles.
- **Fase 1 — Biblioteca + ingesta:** Supabase schema, upload any-doc pipeline,
  real reader rendering normalized sections.
- **Fase 2 — Pautas + on-demand:** editor writes pautas → system prompt;
  floating ✨ generation anchored to position; Momentos gallery.
- **Fase 3 — Ambient:** boundary/idle detection, ambient cards, intensity
  setting.
- **Fase 4 — Mercado pequeño:** upload-to-marketplace flow, listing page.
- **Post-MVP:** social behind flag, TTS narration, video moments.

---

## 8. Why this demonstrates GenAI skill (portfolio narrative)

1. **Document understanding** — multi-format ingestion → normalized, chunked,
   embedded corpus per book.
2. **Prompt engineering as product** — pautas: natural-language behavior
   direction, per-book system prompts.
3. **RAG in production** — every generation grounded in position-aware chunks.
4. **Agentic behavior** — ambient engine deciding *when* and *what* to generate.
5. **Multimodal** — text, image, (later audio) generations from one engine.
6. **Taste** — restraint: ambient never interrupts; intensity is user-controlled.
