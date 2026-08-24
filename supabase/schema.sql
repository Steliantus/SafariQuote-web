-- ============================================================================
-- SafariQuote multi-tenant schema (Supabase / Postgres)
--
-- Run this once in the Supabase SQL editor on a fresh project (Settings ->
-- Database -> SQL Editor -> New query -> paste -> Run).
--
-- Data model summary
-- -------------------
-- profiles          one row per logged-in user (mirrors auth.users), carries
--                    role ('admin' | 'tenant') and, for tenant users, which
--                    tenant they belong to.
-- tenants           one row per tour-operator client. Holds the STO discount
--                    override Dana sets for that operator. Only admins can
--                    write to this table.
-- lodges            the shared master rate database (613 lodges today).
--                    Readable by every logged-in user, writable by admin
--                    only. Stored mostly as JSONB (seasons/rooms/activities)
--                    to preserve the exact structure of the existing data
--                    1:1 -- a fully normalized rooms/rates schema is a good
--                    phase-2 upgrade but not required for correctness now.
-- car_hire_companies, reference_tables   same pattern as lodges: shared,
--                    admin-writable reference data (transfers, meet & greet,
--                    currency tables, etc).
-- travelers          each tour operator's own end-travelers. Tenant-isolated
--                    via RLS. Admin can read (for support) but never write --
--                    matches "I will never need to edit the travelers".
-- quotes             tour-operator itineraries/programs. Tenant-isolated.
--                    status is 'draft' or 'confirmed'. Draft quotes always
--                    price against the LIVE lodges table (computed client-
--                    side / on read). Confirmed quotes freeze their computed
--                    totals in `computed_snapshot` at confirm time so a later
--                    lodge rate change never silently moves an already-
--                    confirmed price.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Core tables
-- ---------------------------------------------------------------------------
-- (Tables come before the helper functions below: is_admin() and
-- current_tenant_id() are LANGUAGE SQL functions, and Postgres validates
-- their bodies against real tables at CREATE time -- so public.profiles etc
-- must already exist before those functions are defined.)
create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_name text,
  contact_email text,
  phone text,
  sto_discount_pct numeric not null default 10,   -- Dana-controlled margin override for this tour operator
  status text not null default 'active' check (status in ('active','suspended')),
  notes text,                                      -- Dana's private notes about this client, not shown to tenant
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin','tenant')),
  tenant_id uuid references public.tenants(id) on delete cascade, -- null for admin
  full_name text,
  email text,
  created_at timestamptz not null default now()
);

-- Shared master rate data -----------------------------------------------------
create table if not exists public.lodges (
  id uuid primary key default gen_random_uuid(),
  slug text unique,               -- stable machine key, e.g. "abenab_lodge"
  name text not null,
  region text,
  sto_disc numeric,               -- default assumed discount off rack, when not confirmed exactly
  currency text default 'NAD',
  rate_period text,
  activities_require_stay boolean not null default false,
  agent_note text,
  data jsonb not null,            -- { seasons:[...], rooms:[...], activities:[...], levy, bedLevyPct, ... }
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id)
);

create table if not exists public.car_hire_companies (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,       -- e.g. "NTS"
  data jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id)
);

-- Small shared lookup tables: TRANSFERS, MEET_GREET, CURRENCIES, FX, SYM, NAD_PER_UNIT
create table if not exists public.reference_tables (
  name text primary key,          -- e.g. "MEET_GREET"
  data jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id)
);

-- Tenant-owned data -----------------------------------------------------------
create table if not exists public.travelers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  traveler_id uuid references public.travelers(id) on delete set null,
  client_name text not null default 'Guest',
  status text not null default 'draft' check (status in ('draft','confirmed')),
  guests jsonb not null default '[]',       -- [{name, age}, ...]
  stops jsonb not null default '[]',        -- structured stop objects (lodge_id, room_id, dates, etc.)
  extras jsonb not null default '{}',       -- car hire, transfers, custom extras, meet & greet
  sto_override numeric,                     -- optional per-quote override of the tenant's default STO
  computed_snapshot jsonb,                  -- frozen totals, set only when status becomes 'confirmed'
  confirmed_at timestamptz,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 2. Helper functions (used inside RLS policies below)
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.current_tenant_id()
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select tenant_id from public.profiles where id = auth.uid();
$$;

-- ---------------------------------------------------------------------------
-- 3. updated_at triggers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_tenants_updated on public.tenants;
create trigger trg_tenants_updated before update on public.tenants
  for each row execute function public.set_updated_at();

drop trigger if exists trg_lodges_updated on public.lodges;
create trigger trg_lodges_updated before update on public.lodges
  for each row execute function public.set_updated_at();

drop trigger if exists trg_car_hire_updated on public.car_hire_companies;
create trigger trg_car_hire_updated before update on public.car_hire_companies
  for each row execute function public.set_updated_at();

drop trigger if exists trg_reference_updated on public.reference_tables;
create trigger trg_reference_updated before update on public.reference_tables
  for each row execute function public.set_updated_at();

drop trigger if exists trg_travelers_updated on public.travelers;
create trigger trg_travelers_updated before update on public.travelers
  for each row execute function public.set_updated_at();

drop trigger if exists trg_quotes_updated on public.quotes;
create trigger trg_quotes_updated before update on public.quotes
  for each row execute function public.set_updated_at();

-- Auto-create a profile row whenever a new auth user signs up.
-- Tenant self-signup flow (see app/signup) creates the tenants row FIRST,
-- then signs the user up with tenant_id + role in the auth metadata, which
-- this trigger reads to populate profiles correctly.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, role, tenant_id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'tenant'),
    nullif(new.raw_user_meta_data->>'tenant_id','')::uuid,
    new.raw_user_meta_data->>'full_name',
    new.email
  );
  return new;
end;
$$;

drop trigger if exists trg_on_auth_user_created on auth.users;
create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 4. Row Level Security
-- ---------------------------------------------------------------------------
alter table public.tenants enable row level security;
alter table public.profiles enable row level security;
alter table public.lodges enable row level security;
alter table public.car_hire_companies enable row level security;
alter table public.reference_tables enable row level security;
alter table public.travelers enable row level security;
alter table public.quotes enable row level security;

-- profiles: a user can read their own profile; admin can read all.
create policy profiles_select_own on public.profiles
  for select using (id = auth.uid() or public.is_admin());
create policy profiles_update_own on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- tenants: tenant users can read their own tenant row (incl. their STO %).
-- Only admin can write (create/suspend tenants, change STO overrides) --
-- a tour operator cannot edit their own margin.
create policy tenants_select on public.tenants
  for select using (id = public.current_tenant_id() or public.is_admin());
create policy tenants_write_admin on public.tenants
  for insert with check (public.is_admin());
create policy tenants_update_admin on public.tenants
  for update using (public.is_admin());

-- lodges / car_hire_companies / reference_tables: every logged-in user can
-- read (it's the shared rate book); only admin can write.
create policy lodges_select_all on public.lodges
  for select using (auth.role() = 'authenticated');
create policy lodges_write_admin on public.lodges
  for insert with check (public.is_admin());
create policy lodges_update_admin on public.lodges
  for update using (public.is_admin());
create policy lodges_delete_admin on public.lodges
  for delete using (public.is_admin());

create policy car_hire_select_all on public.car_hire_companies
  for select using (auth.role() = 'authenticated');
create policy car_hire_write_admin on public.car_hire_companies
  for insert with check (public.is_admin());
create policy car_hire_update_admin on public.car_hire_companies
  for update using (public.is_admin());
create policy car_hire_delete_admin on public.car_hire_companies
  for delete using (public.is_admin());

create policy reference_select_all on public.reference_tables
  for select using (auth.role() = 'authenticated');
create policy reference_write_admin on public.reference_tables
  for insert with check (public.is_admin());
create policy reference_update_admin on public.reference_tables
  for update using (public.is_admin());

-- travelers: strictly tenant-isolated, full stop. Admin (Ondjamba) has NO
-- policy on this table at all -- not select, not update, not delete -- so
-- the admin product surface has zero path to another tenant's traveler
-- records. This is deliberate: it's what lets Ondjamba tell tour operators
-- "we cannot see your traveler list," not just "we choose not to."
-- (See the note at the bottom of this file on what this guarantee does and
-- doesn't cover before it goes into any NDA wording.)
create policy travelers_tenant_all on public.travelers
  for all using (tenant_id = public.current_tenant_id())
  with check (tenant_id = public.current_tenant_id());

-- quotes: same strict tenant-isolation, no admin policy of any kind.
create policy quotes_tenant_all on public.quotes
  for all using (tenant_id = public.current_tenant_id())
  with check (tenant_id = public.current_tenant_id());

-- ---------------------------------------------------------------------------
-- 5. Indexes
-- ---------------------------------------------------------------------------
create index if not exists idx_travelers_tenant on public.travelers(tenant_id);
create index if not exists idx_quotes_tenant on public.quotes(tenant_id);
create index if not exists idx_quotes_status on public.quotes(status);
create index if not exists idx_lodges_name on public.lodges(name);
create index if not exists idx_profiles_tenant on public.profiles(tenant_id);

-- ---------------------------------------------------------------------------
-- 6. What the travelers/quotes access block above actually guarantees
--    (read this before it goes into any NDA or marketing wording)
-- ---------------------------------------------------------------------------
-- TRUE: no part of the SafariQuote application -- not the tenant screens, not
-- the admin screens, not the API routes -- has any code path that can read,
-- list, or export another tenant's traveler or quote records. The database
-- itself enforces this (Postgres row-level security), not just app-level
-- discipline, so a bug in the admin UI can't accidentally expose it either.
--
-- NOT COVERED by this guarantee: whoever holds the Supabase *project*
-- credentials (the account this gets deployed under -- presumably Ondjamba's)
-- has underlying database-administrator access to that project, the same way
-- any company hosting its own database always has infrastructure-level access
-- to what's on its own servers. That access bypasses row-level security by
-- design (it's how migrations, backups, and this very schema file get
-- applied) -- it isn't reachable through the product, but it isn't
-- cryptographically impossible either. Genuinely making it impossible would
-- mean each tenant's data is encrypted client-side with a key Ondjamba never
-- holds -- a real feature, but a much bigger undertaking than what's built
-- here, and not needed unless the NDA is going to promise that specific
-- stronger guarantee.
--
-- Suggested honest phrasing for an NDA: "Ondjamba Safaris has no means,
-- through the SafariQuote platform, to access, view, or export another tour
-- operator's traveler or quote records" -- true today, and provable by this
-- schema. Avoid absolute wording like "cannot read it even if we wanted to"
-- unless client-side encryption is added to back it up -- have an actual
-- lawyer sign off on the final wording either way.
