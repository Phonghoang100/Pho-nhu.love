-- ============================================================
--  Phong & Nhu Wedding — Supabase schema (open RSVP)
--  Run this in the Supabase SQL Editor (one time).
--
--  Model: anyone with the link submits an RSVP with their name.
--  Security:
--    * Guests submit ONLY through the submit_rsvp() function.
--      The public "anon" key cannot read or write the table directly
--      (Row Level Security blocks it), so no one can view or scrape
--      other people's responses.
--    * Re-submitting with the same name UPDATES that entry instead of
--      creating a duplicate — this is how "edit later" works.
--    * The couple (logged-in users) get full read access for the admin
--      dashboard.
-- ============================================================

create extension if not exists pgcrypto;

-- ---------- Table ----------
drop view if exists public.v_admin_rsvps;

create table if not exists public.rsvps (
  id             uuid primary key default gen_random_uuid(),
  full_name      text not null,
  -- normalized name used to prevent duplicates / allow edits
  name_key       text generated always as (lower(btrim(full_name))) stored unique,
  status         text not null check (status in ('accepted','declined')),
  plus_one       boolean not null default false,
  plus_one_name  text,
  children       int not null default 0,
  children_names text,
  dietary        text,
  message        text,
  phone          text,
  email          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ---------- Row Level Security ----------
alter table public.rsvps enable row level security;

drop policy if exists admin_rsvps on public.rsvps;
-- Only logged-in users (the couple) can read/write directly.
create policy admin_rsvps on public.rsvps
  for all to authenticated using (true) with check (true);
-- No policy for "anon" => the public key can't read or write the table.
-- Guests go through submit_rsvp() below.

-- ============================================================
--  Guest submission function (definer => bypasses RLS safely)
-- ============================================================
create or replace function public.submit_rsvp(
  p_full_name text,
  p_status text,
  p_plus_one boolean,
  p_plus_one_name text,
  p_children int,
  p_children_names text,
  p_dietary text,
  p_message text,
  p_phone text,
  p_email text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  res public.rsvps;
  po boolean;
  ch int;
begin
  if btrim(coalesce(p_full_name, '')) = '' then
    raise exception 'Please enter your name.';
  end if;
  if p_status not in ('accepted','declined') then
    raise exception 'Please let us know if you can attend.';
  end if;

  po := coalesce(p_plus_one, false);
  ch := greatest(0, coalesce(p_children, 0));
  if p_status = 'declined' then
    po := false; ch := 0;
  end if;

  insert into public.rsvps as r
    (full_name, status, plus_one, plus_one_name, children,
     children_names, dietary, message, phone, email, updated_at)
  values
    (btrim(p_full_name), p_status, po,
     nullif(btrim(coalesce(p_plus_one_name,'')),''), ch,
     nullif(btrim(coalesce(p_children_names,'')),''),
     nullif(btrim(coalesce(p_dietary,'')),''),
     nullif(btrim(coalesce(p_message,'')),''),
     nullif(btrim(coalesce(p_phone,'')),''),
     nullif(btrim(coalesce(p_email,'')),''),
     now())
  on conflict (name_key) do update set
     full_name = excluded.full_name,
     status = excluded.status,
     plus_one = excluded.plus_one,
     plus_one_name = excluded.plus_one_name,
     children = excluded.children,
     children_names = excluded.children_names,
     dietary = excluded.dietary,
     message = excluded.message,
     phone = excluded.phone,
     email = excluded.email,
     updated_at = now()
  returning * into res;

  return to_jsonb(res);
end;
$$;

grant execute on function public.submit_rsvp(text, text, boolean, text, int, text, text, text, text, text) to anon, authenticated;

-- Lightweight heartbeat used by the free "keep-alive" GitHub Action so the
-- Supabase project doesn't pause after 7 days of inactivity. Returns the time.
create or replace function public.ping()
returns timestamptz language sql security definer set search_path = public as $$
  select now();
$$;
grant execute on function public.ping() to anon, authenticated;

-- ============================================================
--  Admin view (couple only)
-- ============================================================
create or replace view public.v_admin_rsvps
with (security_invoker = true) as
select id, full_name, status, plus_one, plus_one_name, children, children_names,
       dietary, message, phone, email, created_at, updated_at
from public.rsvps;

grant select on public.v_admin_rsvps to authenticated;

-- ============================================================
--  DONE. No guest list to import — guests just submit their name.
--  Next: add the couple's admin login in Authentication → Users.
-- ============================================================
