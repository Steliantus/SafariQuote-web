-- ============================================================================
-- Public trial lead capture
--
-- Backs the /trial signup form: records name/company/email for marketing
-- follow-up before the visitor is signed into the fixed demo tenant login
-- (see app/trial/page.js and lib/demo.js). RLS is enabled with NO policies
-- defined at all, so only the service-role client (createAdminClient()) can
-- read or write this table -- nobody's anon/authenticated session can.
--
-- This table was originally created directly via the SQL Editor; this file
-- documents it for history and so a fresh environment can recreate it.
-- ============================================================================

create table if not exists public.trial_leads (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    company text not null,
    email text not null,
    created_at timestamptz not null default now()
  );

alter table public.trial_leads enable row level security;
-- RLS enabled, NO policies defined -> only service-role client can read/write it.
