# Deploying SafariQuote (web edition)

This is a Next.js app backed by Supabase (Postgres + auth + row-level
security). You'll need a free GitHub account, a free Supabase account, and a
Netlify account (Netlify's free tier covers this comfortably at your scale).

## 1. Create the Supabase project

1. Go to supabase.com, create a new project (pick a region close to Namibia,
   e.g. Frankfurt or Cape Town if offered).
2. Once it's provisioned, open the SQL Editor and paste in the entire
   contents of `supabase/schema.sql` from this project, then run it. This
   creates every table, the tenant-isolation security rules, and the
   auto-profile trigger.
3. Go to Project Settings → API. You'll need three values from this page:
   - `Project URL` → this is `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → this is `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` `secret` key → this is `SUPABASE_SERVICE_ROLE_KEY`
     (treat this one like a master password — never put it in the browser
     or commit it to git; it's only used by the seed script and the
     admin-only server routes).

## 2. Load the lodge data

On your own machine (or ask me to do this for you if you'd rather):

```bash
npm install
SUPABASE_URL=https://your-project.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key \
node scripts/seed.mjs
```

This loads all 613 lodges, car hire companies, and the reference tables
(transfers, meet & greet, currencies) from `data/extracted/`. It's safe to
re-run any time you've refreshed those JSON files after processing new rate
sheets — it upserts by lodge slug, so existing lodges get updated and new
ones get added.

## 3. Create Dana's admin account

There's deliberately no public sign-up page — only Ondjamba can create
accounts. So the very first account (Dana's) has to be created manually,
once:

1. In the Supabase dashboard, go to Authentication → Users → Add user →
   Create new user. Enter Dana's email and a temporary password.
2. Go to the SQL Editor and run:
   ```sql
   update public.profiles set role = 'admin', tenant_id = null
   where email = 'dana@example.com';  -- her real email
   ```
3. Dana can now log in at your site's `/login` with that email/password
   (she can change the password later from Supabase, or we can wire up a
   proper "change password" screen in a later round).

Every tour-operator account after this one is created normally, from inside
the app: **Admin → Tour Operators → + Add tour operator**. That sends them
an email invite automatically — no manual Supabase steps needed for them.

## 4. Deploy to Netlify

Netlify builds this from a git repository (a plain drag-and-drop upload
won't work for a Next.js app with server logic like this one).

1. Push this project to a new GitHub repository (ask me to do this and I
   will, or do it yourself with `git init && git add -A && git commit -m
   "SafariQuote web" && git remote add origin <your-repo-url> && git push`).
2. In Netlify: Add new site → Import an existing project → pick the repo.
   Netlify will detect `netlify.toml` and the Next.js plugin automatically.
3. Before the first deploy, add the environment variables (Site settings →
   Environment variables):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (needed for the admin invite-tenant route)
   - `NEXT_PUBLIC_SITE_URL` — your final site URL (e.g.
     `https://quotes.ondjamba.com`), used to build the invite-email link.
4. Deploy. Netlify gives you a `*.netlify.app` URL immediately; point a
   real domain at it afterwards (Site settings → Domain management →
   Add a domain).

   **Use a new, standalone domain that doesn't reference Ondjamba** — not a
   subdomain of Ondjamba's Wix site. Each tour operator will be logging into
   this daily and storing their own client list and resale pricing in it;
   a domain that visibly reads as "Ondjamba's own site" undercuts the "we
   cannot see your data" guarantee below by looking like the opposite. A
   plain domain (~$10–15/year from any registrar) works fine — the product
   can still say "built for Ondjamba Safaris" inside the UI without living
   at ondjamba's own address. This is separate from the earlier public
   trial-website workstream in the project brief, where borrowing Ondjamba's
   credibility with cold prospects was actually the goal — that one-time
   landing page can stay a Wix subdomain; the login app itself should not.

## 5. Supabase auth email settings (do this before inviting real tenants)

By default Supabase sends invite emails from its own shared domain, which is
fine to start with but can land in spam. Once you're ready for real tour
operators:

- Authentication → URL Configuration: set **Site URL** to your real domain
  and add it to **Redirect URLs** (needed for the invite-email link to work).
- Authentication → Email Templates → Invite user: customize the wording if
  you'd like it to sound like Ondjamba rather than generic Supabase copy.
- (Optional, recommended before real volume) Authentication → SMTP Settings:
  connect your own email sending domain so invite emails come from
  `@ondjamba...` instead of Supabase's shared sender.

## Data access guarantee (for the NDA / tour-operator agreement)

Travelers and quotes are strictly tenant-isolated at the database level
(Postgres row-level security) — the admin side of the app has no read,
write, or export path to another tenant's traveler or quote records at all.
That's enforced by `supabase/schema.sql`, not just by what buttons the admin
screens happen to show, so it holds even if the admin UI changes later.

One honest caveat before this goes into a legal document: whoever holds the
Supabase project's own credentials (the account this is deployed under)
retains underlying database-administrator access to that project, the same
way any company hosting its own database has infrastructure-level access to
its own servers — that's separate from, and not blocked by, the row-level
security above. See the note at the bottom of `supabase/schema.sql` for
suggested wording that's accurate to what's actually built. Have an actual
lawyer review the final NDA language.

## What's included in this first version vs. what's still to build

**Included:** tenant accounts + login (invite-only), per-tenant STO discount
set by Dana, the shared live lodge rate database editable from `/admin`,
tenant-isolated traveler records, a quote builder covering the core
accommodation pricing engine (seasons, STO overrides, single supplement,
conservation levy, bed levy, per-lodge activities, activities-only day
visits, meal add-ons), and draft-vs-confirmed price locking.

**Not yet ported from the original tool** (flagged in the project brief as
the next layer to add): standalone car hire, transfers/meet & greet,
FlyNamibia sectors, custom line-item extras, Excel/PDF export, and a couple
of lodge-specific UI touches (e.g. the Zannier live-rate widget). These all
have their data already loaded (`car_hire_companies`, `reference_tables`)
and are a good scope for the next build session.
