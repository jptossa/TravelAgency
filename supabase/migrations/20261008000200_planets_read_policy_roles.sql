-- Recreate the read policy scoped explicitly to the API roles. The original
-- policy (no `to` clause) did not expose rows to the anon key in practice.
drop policy if exists "Planets are publicly readable" on public.planets;

create policy "Planets are publicly readable"
  on public.planets for select
  to anon, authenticated
  using (true);
