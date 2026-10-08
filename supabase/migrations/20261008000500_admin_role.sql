-- Admin role: admins can edit planets and review/decide booking requests.
-- profiles.role already exists; users cannot change it themselves (column-level
-- grant in the user-accounts migration). Promote the first admin manually:
--   update public.profiles set role = 'admin'
--   where id = (select id from auth.users where email = 'you@example.com');

-- Security definer so it can read profiles without recursing through RLS
-- when used inside policies (including policies on profiles itself).
create function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- Planets: admins may update; reads stay public.
create policy "Admins can update planets"
  on public.planets for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

grant update on public.planets to authenticated;

-- Profiles: admins can see everyone's display name.
create policy "Admins can read all profiles"
  on public.profiles for select
  to authenticated
  using (public.is_admin());

-- Booking requests: admins can see all and change only the status.
create policy "Admins can read all booking requests"
  on public.booking_requests for select
  to authenticated
  using (public.is_admin());

create policy "Admins can update booking requests"
  on public.booking_requests for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

grant update (status) on public.booking_requests to authenticated;
