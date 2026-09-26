-- DeepBooks — Fase 2: RAG retrieval + texto de salida en momentos
-- Roger aplica este archivo en el SQL editor de su proyecto Supabase,
-- después de 001_init.sql.

-- El texto generado se guarda en línea (Fase 2: solo texto; output_ref
-- queda para artefactos multimedia en fases posteriores).
alter table momentos add column if not exists output_text text;

-- RAG: k fragmentos más cercanos (distancia coseno) dentro de un libro.
-- p_query_embedding llega como texto "[0.1,0.2,...]" y se castea a vector.
create or replace function match_chunks(
  p_book_id uuid,
  p_query_embedding text,
  p_k int default 6
)
returns table (
  chunk_id uuid,
  section_id uuid,
  section_idx int,
  section_title text,
  chunk_text text,
  distance float
)
language sql stable
as $$
  select
    c.id,
    c.section_id,
    s.idx,
    s.title,
    c.text,
    c.embedding <=> p_query_embedding::vector as distance
  from chunks c
  join sections s on s.id = c.section_id
  where c.book_id = p_book_id
    and c.embedding is not null
  order by distance
  limit p_k;
$$;

comment on function match_chunks(uuid, text, int) is
  'RAG Fase 2: k fragmentos más cercanos por distancia coseno para un libro.';
