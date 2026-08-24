-- ============================================================================
-- Tenant-private per-lodge STO discount rates
--
-- Lets each tour operator record their own negotiated STO% for a given lodge,
-- without Ondjamba (admin) ever being able to read it through the product.
-- Mirrors the travelers/quotes pattern in schema.sql: RLS enabled, exactly one
-- policy scoped to the signed-in tenant, and deliberately NO admin policy at
-- all -- so is_admin() has no matching policy and gets zero rows back, the
-- same guarantee already documented for travelers/quotes at the bottom of
-- schema.sql.
-- ============================================================================

create table if not exists public.tenant_lodge_rates (
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  lodge_id uuid not null references public.lodges(id) on delete cascade,
  sto_disc numeric not null,
  updated_at timestamptz not null default now(),
  primary key (tenant_id, lodge_id)
);

alter table public.tenant_lodge_rates enable row level security;

create policy tenant_lodge_rates_tenant_all on public.tenant_lodge_rates
  for all using (tenant_id = public.current_tenant_id())
  with check (tenant_id = public.current_tenant_id());

drop trigger if exists trg_tenant_lodge_rates_updated on public.tenant_lodge_rates;
create trigger trg_tenant_lodge_rates_updated before update on public.tenant_lodge_rates
  for each row execute function public.set_updated_at();

create index if not exists idx_tenant_lodge_rates_tenant on public.tenant_lodge_rates(tenant_id);
create index if not exists idx_tenant_lodge_rates_lodge on public.tenant_lodge_rates(lodge_id);
