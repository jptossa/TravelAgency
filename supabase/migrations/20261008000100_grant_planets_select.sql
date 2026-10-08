-- RLS policies only filter rows; the API roles also need table-level privileges.
-- Without this, reads fail with "permission denied for table planets".
grant usage on schema public to anon, authenticated;
grant select on public.planets to anon, authenticated;
