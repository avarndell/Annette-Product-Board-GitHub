-- Run this in Supabase: SQL Editor > New query > Run.
-- The app requires a signed-in Supabase user; do not leave anonymous access enabled.
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  recipient text,
  occasion text,
  product_type text,
  stage text not null default 'To Research',
  priority text not null default 'Medium',
  notes text default '',
  research_notes text default '',
  image_url text,
  ad_spend numeric not null default 0,
  purchases integer not null default 0,
  revenue numeric not null default 0,
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.products enable row level security;
drop policy if exists "Users manage only their own products" on public.products;
create policy "Users manage only their own products" on public.products
  for all to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- After you create your owner account, turn off new signups in:
-- Authentication > Providers > Email > Disable Allow new users to sign up.
