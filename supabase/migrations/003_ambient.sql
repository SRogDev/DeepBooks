-- DeepBooks — Fase 3: momentos ambientales
-- Roger aplica este archivo en el SQL editor de su proyecto Supabase,
-- después de 001_init.sql y 002_match_chunks.sql.
--
-- ambient_intensity: 'off' | 'suave' | 'activo' — lo elige el lector por libro.
-- last_ambient_at: el servidor la actualiza en cada generación para
-- aplicar el cooldown (suave: 20 min, activo: 8 min).

alter table books
  add column ambient_intensity text not null default 'off'
    check (ambient_intensity in ('off', 'suave', 'activo')),
  add column last_ambient_at timestamptz;

comment on column books.ambient_intensity is
  'Intensidad de momentos ambientales (Fase 3): off | suave | activo';
comment on column books.last_ambient_at is
  'Última generación ambiental del libro (cooldown server-side)';

-- RLS: se mantienen las políticas permisivas del MVP (ver 001_init.sql);
-- las columnas nuevas quedan cubiertas por la policy mvp_all existente.
