-- DeepBooks — initial schema (Fase 1: Biblioteca + ingesta)
-- Roger aplica este archivo en el SQL editor de su proyecto Supabase.
-- Tablas de Fase 2+ (pautas, momentos, marketplace_listings) se crean ya
-- para no migrar después; su UI llega en fases posteriores.

create extension if not exists vector;

-- Libros/documentos subidos por el usuario o del mercado
create table books (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid,
  title text not null,
  author text,
  source_type text not null default 'upload'
    check (source_type in ('upload', 'marketplace')),
  file_url text,
  cover_url text,
  language text not null default 'es',
  last_section_idx int not null default 0,
  created_at timestamptz not null default now()
);

-- Unidades de lectura normalizadas (capítulos / secciones detectadas)
create table sections (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references books(id) on delete cascade,
  idx int not null,
  title text,
  text text not null,
  unique (book_id, idx)
);
create index sections_book_idx on sections (book_id, idx);

-- Fragmentos para RAG (embeddings de OpenRouter text-embedding-3-small)
create table chunks (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references books(id) on delete cascade,
  section_id uuid not null references sections(id) on delete cascade,
  chunk_idx int not null,
  text text not null,
  embedding vector(1536)
);
create index chunks_book_idx on chunks (book_id);

-- Pautas de experiencia por libro (Fase 2: el editor las redacta;
-- la ingesta inserta la fila por defecto "Modo DeepBooks")
create table pautas (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null unique references books(id) on delete cascade,
  content text not null,
  is_default boolean not null default true
);

-- Todo lo generativo se guarda aquí (Fase 2+)
create table momentos (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references books(id) on delete cascade,
  user_id uuid,
  kind text not null,
  prompt text,
  output_ref text,
  anchor_section_id uuid references sections(id) on delete set null,
  origin text not null default 'on_demand'
    check (origin in ('on_demand', 'ambient')),
  created_at timestamptz not null default now()
);
create index momentos_book_idx on momentos (book_id, created_at desc);

-- Mercado pequeño: libros que la gente sube directamente (Fase 4)
create table marketplace_listings (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references books(id) on delete cascade,
  price_cents int not null default 0,
  description text,
  created_at timestamptz not null default now()
);

-- RLS: políticas permisivas para authenticated durante el MVP.
-- Post-MVP: restringir por owner_id / políticas por tabla.
alter table books enable row level security;
alter table sections enable row level security;
alter table chunks enable row level security;
alter table pautas enable row level security;
alter table momentos enable row level security;
alter table marketplace_listings enable row level security;

create policy mvp_all on books for all to authenticated
  using (true) with check (true);
create policy mvp_all on sections for all to authenticated
  using (true) with check (true);
create policy mvp_all on chunks for all to authenticated
  using (true) with check (true);
create policy mvp_all on pautas for all to authenticated
  using (true) with check (true);
create policy mvp_all on momentos for all to authenticated
  using (true) with check (true);
create policy mvp_all on marketplace_listings for all to authenticated
  using (true) with check (true);
