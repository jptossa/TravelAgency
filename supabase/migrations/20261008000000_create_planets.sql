-- Planets offered by the agency. Mirrors the Planet type in src/lib/planets.ts.

create table public.planets (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  system text not null,
  description text not null,
  planet_type text not null,            -- e.g. 'Death World', 'Hive World'
  controlling_faction text not null,
  tithe_grade text not null,
  population text not null,             -- descriptive, e.g. 'Over 20 billion'
  climate text not null,
  price_thrones integer not null check (price_thrones >= 0),
  danger_level smallint not null check (danger_level between 1 and 5),
  travel_time text not null,            -- warp transit from Holy Terra
  attractions text[] not null default '{}',
  activities text[] not null default '{}',
  active_conflicts text[] not null default '{}',
  active_enemies text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger planets_set_updated_at
  before update on public.planets
  for each row execute function public.set_updated_at();

-- Planets are public catalogue data: anyone can read, only the service role
-- (which bypasses RLS) can write.
alter table public.planets enable row level security;

create policy "Planets are publicly readable"
  on public.planets for select
  using (true);
