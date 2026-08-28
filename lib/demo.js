import fs from "fs";
import path from "path";

// The "instant self-serve trial" for the public marketing site: a fixed,
// always-present demo tenant + demo login that anyone can be dropped into
// with zero signup friction (see app/trial/route.js). Fully functional --
// real tenant_id, real RLS, real saved quotes -- but scoped to a frozen,
// non-production lodge dataset (data/demo/DEMO_LODGES_2026.json: 2026 rates
// only, flat 10% STO on everything, no confidential agent notes) so it can
// never drift from or leak real client data, and gets wiped nightly (see
// app/api/admin/reset-demo/route.js) so one visitor's session never bleeds
// into the next.
//
// IMPORTANT: DEMO_TENANT_ID must exactly match the id of the row inserted
// for this tenant in `public.tenants` (see DEPLOY_TRIAL.md). DEMO_EMAIL must
// exactly match the one fixed auth user created for the trial. Neither of
// these is ever accepted from user input anywhere in this app -- the whole
// point of the design is that /trial logs everyone into this ONE fixed
// identity, never anything visitor-supplied.
export const DEMO_TENANT_ID = "ad4e41ba-ada6-4ca5-bf9d-14a78fb5407c";
export const DEMO_EMAIL = "demo.trial@safariquote.app";

export function isDemoTenant(tenantId) {
  return tenantId === DEMO_TENANT_ID;
}

let _cache = null;
function loadDemoLodges() {
  if (_cache) return _cache;
  const file = path.join(process.cwd(), "data", "demo", "DEMO_LODGES_2026.json");
  _cache = JSON.parse(fs.readFileSync(file, "utf8"));
  return _cache;
}

// Shape-compatible with `supabase.from("lodges").select("id, name, region")`
export function getDemoLodgeList() {
  return loadDemoLodges().map(({ id, name, region }) => ({ id, name, region }));
}

// Shape-compatible with `supabase.from("lodges").select("id, name, data").eq("id", id).single()`
export function getDemoLodgeById(id) {
  const lodge = loadDemoLodges().find((l) => l.id === id);
  if (!lodge) return null;
  const { id: lodgeId, name, ...data } = lodge;
  return { id: lodgeId, name, data };
}
