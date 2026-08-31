-- ============================================================================
-- Flag Ondjamba's own tenant as the "master rate source"
--
-- Context: the `lodges.sto_disc` figure stored per lodge is, for almost every
-- lodge, Ondjamba's own individually-negotiated STO% with that property (sent
-- to Ondjamba directly by the lodge) -- not a rate every tour operator is
-- entitled to by default. Before this migration, a brand-new tour operator's
-- quotes silently used that exact same negotiated number, handing out
-- Ondjamba's own contracted margin to anyone who signed up.
--
-- Fix: every tenant EXCEPT Ondjamba's own now defaults to
-- LEAST(lodge.sto_disc, tenants.sto_discount_pct) the first time a lodge is
-- picked on a quote (see app/quotes/[id]/QuoteBuilder.js, handleLodgeChange) --
-- so a lodge stated at 0% stays 0% for everyone, and anything higher is
-- capped at that tenant's own negotiated ceiling (10% by default) until they
-- record their own better rate (tenant_lodge_rates, or the My Rates
-- spreadsheet). Ondjamba's own tenant is exempted via this flag: its quotes
-- keep using each lodge's own contracted rate directly and unchanged, since
-- that data is Ondjamba's own to begin with.
-- ============================================================================

alter table public.tenants add column if not exists is_master_rate_source boolean not null default false;

comment on column public.tenants.is_master_rate_source is 'True only for the Ondjamba tenant. Its quotes use each lodge''s own stated sto_disc directly and uncapped. Every other tenant defaults to LEAST(lodge.sto_disc, tenants.sto_discount_pct) until a tenant_lodge_rates override is set.';

update public.tenants set is_master_rate_source = true where contact_email = 'dana@ondjamba.com.na';

-- Sanity check -- should show exactly one `true` row (Ondjamba) and every
-- other tenant `false`.
select id, company_name, contact_email, sto_discount_pct, is_master_rate_source from public.tenants order by created_at;
