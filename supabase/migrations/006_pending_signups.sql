-- ============================================================================
-- Pending signups -- details captured on the public /signup form before
-- payment
--
-- A visitor fills in company/contact/phone on /signup (see
-- app/signup/page.js), which stores it here and then sends them to the Wix
-- Pay Link to actually pay. Wix's own checkout only reliably captures the
-- payer's email, not a company name or phone number -- so once the Wix
-- Automation calls app/api/signup/webhook/route.js after a successful
-- payment, that webhook looks up the most recent row here matching the
-- payer's email and fills in whatever Wix's payload didn't send. The row is
-- deleted once it's been consumed by a successful tenant provisioning.
--
-- Same pattern as trial_leads (003_trial_leads.sql): RLS enabled with NO
-- policies defined, so only the service-role client (createAdminClient())
-- can read or write it -- nobody's anon/authenticated session can.
-- ============================================================================

create table if not exists public.pending_signups (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_name text,
  contact_email text not null,
  phone text,
  created_at timestamptz not null default now()
);

alter table public.pending_signups enable row level security;
-- RLS enabled, NO policies defined -> only service-role client can read/write it.

create index if not exists idx_pending_signups_email on public.pending_signups(contact_email);
