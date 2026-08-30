# Public trial ("test flight") setup

This describes the self-serve trial at `/trial`, linked from the marketing
site. It's a separate concern from the tour-operator app covered in
`DEPLOY.md` -- read that first for the base Supabase/Netlify setup.

## What it does

`/trial` lets an anonymous visitor try the product with zero signup friction
for a real account, while still capturing their details for marketing:

1. Visitor fills in name / company / email on `/trial`.
2. The server action (`startTrial` in `app/trial/page.js`) inserts that into
   `public.trial_leads` (service-role client, RLS-locked -- see
   `supabase/migrations/003_trial_leads.sql`). That email is never used to
   sign in; it's a marketing record only.
3. It then signs the visitor in as one single fixed account, `DEMO_EMAIL`
   (`lib/demo.js`), scoped to one fixed `DEMO_TENANT_ID` -- never anything
   visitor-supplied.
4. A fresh draft quote is created for that demo tenant and the visitor is
   redirected straight into it (`/quotes/{id}`), so they land in a real,
   working Quote Builder pre-loaded with the frozen demo lodge dataset
   (`data/demo/DEMO_LODGES_2026.json`) instead of an empty dashboard.

Because every visitor shares the one demo tenant, the demo data has to be
wiped regularly (see below) so one visitor's quotes/travelers never bleed
into the next visitor's trial.

## One-time setup

1. Create the fixed demo auth user in Supabase (Authentication -> Users ->
   Add user) with the exact email in `DEMO_EMAIL`, and a row for it in
   `public.tenants` whose id exactly matches `DEMO_TENANT_ID`. Both constants
   live in `lib/demo.js` -- they must match exactly, in both directions.
2. Run `supabase/migrations/003_trial_leads.sql` (SQL Editor) if the
   `trial_leads` table doesn't already exist.
3. In Netlify (Site settings -> Environment variables), set
   `DEMO_RESET_TOKEN` to a long random secret. This guards the nightly reset
   endpoint below -- treat it like a password, never commit its value to
   this repo.

## Nightly reset

`POST /api/admin/reset-demo` (`app/api/admin/reset-demo/route.js`) deletes
every row in `quotes` and `travelers` for `DEMO_TENANT_ID`. It's guarded by
the `x-reset-token` header, which must match the `DEMO_RESET_TOKEN` env var
above -- without a match it 401s. It only ever touches the one demo
tenant's rows; there's no path from this endpoint to any real tenant's data.

This is called once nightly by a scheduled job that POSTs to
`https://app.safariquotehub.com/api/admin/reset-demo` with that header set.
It isn't linked from anywhere in the app UI. If the scheduled job is ever
lost, demo data just accumulates until it's re-run manually or the job is
recreated -- it fails safe, it doesn't break the trial.

## Status

Live and verified end-to-end on production as of 2026-08-30: submitting the
`/trial` form signs the visitor in and redirects to a working `/quotes/{id}`.
