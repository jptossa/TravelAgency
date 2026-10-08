-- User accounts: profiles, wishlist and booking requests.
-- Supabase Auth owns auth.users; everything here references it.

-- Profiles ----------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

-- Create a profile automatically for every new auth user.
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'display_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;

create policy "Users can read their own profile"
  on public.profiles for select
  to authenticated
  using (id = (select auth.uid()));

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- Column-level grant so users can change their display name but never their role.
grant select on public.profiles to authenticated;
grant update (display_name) on public.profiles to authenticated;

-- Wishlist ----------------------------------------------------------------

create table public.wishlist_items (
  user_id uuid not null references auth.users (id) on delete cascade,
  planet_id uuid not null references public.planets (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, planet_id)
);

alter table public.wishlist_items enable row level security;

create policy "Users can read their own wishlist"
  on public.wishlist_items for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy "Users can add to their own wishlist"
  on public.wishlist_items for insert
  to authenticated
  with check (user_id = (select auth.uid()));

create policy "Users can remove from their own wishlist"
  on public.wishlist_items for delete
  to authenticated
  using (user_id = (select auth.uid()));

grant select, insert, delete on public.wishlist_items to authenticated;

-- Booking requests --------------------------------------------------------

create table public.booking_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  planet_id uuid not null references public.planets (id) on delete restrict,
  travelers smallint not null check (travelers between 1 and 20),
  departure_date date not null,
  notes text,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'declined', 'cancelled')),
  created_at timestamptz not null default now()
);

create index booking_requests_user_id_idx on public.booking_requests (user_id);

alter table public.booking_requests enable row level security;

create policy "Users can read their own booking requests"
  on public.booking_requests for select
  to authenticated
  using (user_id = (select auth.uid()));

-- New requests are always created as pending; staff change status later.
create policy "Users can create their own booking requests"
  on public.booking_requests for insert
  to authenticated
  with check (user_id = (select auth.uid()) and status = 'pending');

grant select, insert on public.booking_requests to authenticated;
