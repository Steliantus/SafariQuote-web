-- ============================================================================
-- Lodge submissions -- tour operators suggesting lodges not yet in the
-- shared rate book
--
-- Part of the "My Rates" spreadsheet (app/my-rates): alongside editing their
-- own STO% at existing lodges, a tour operator can list lodges they already
-- use that aren't in SafariQuote yet. Those go here as a review queue, NOT
-- straight into the shared `lodges` table -- an admin has to actually
-- onboard the lodge (rooms, seasons, real rates) before it can be quoted, so
-- this table just captures "please add this one" for Ondjamba to follow up
-- on, together with the rate the tenant says they've negotiated with it.
--
-- Unlike tenant_lodge_rates, this table IS admin-readable -- its entire
-- purpose is to be reviewed by Ondjamba -- but still tenant-isolated for
-- writes/inserts (a tenant only ever sees and creates their own
-- submissions).
-- ============================================================================

create table if not exists public.lodge_submissions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  lodge_name text not null,
  region text,
  sto_disc numeric,           -- the rate the tenant says they've negotiated
  notes text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.lodge_submissions enable row level security;

-- Tenants can create and read their own submissions (so they can see what
-- they've already flagged), but never edit/delete once submitted -- only an
-- admin resolves them (see admin policy below).
create policy lodge_submissions_tenant_select on public.lodge_submissions
  for select using (tenant_id = public.current_tenant_id() or public.is_admin());
create policy lodge_submissions_tenant_insert on public.lodge_submissions
  for insert with check (tenant_id = public.current_tenant_id());
create policy lodge_submissions_admin_update on public.lodge_submissions
  for update using (public.is_admin());

drop trigger if exists trg_lodge_submissions_updated on public.lodge_submissions;
create trigger trg_lodge_submissions_updated before update on public.lodge_submissions
  for each row execute function public.set_updated_at();

create index if not exists idx_lodge_submissions_tenant on public.lodge_submissions(tenant_id);
create index if not exists idx_lodge_submissions_status on public.lodge_submissions(status);
