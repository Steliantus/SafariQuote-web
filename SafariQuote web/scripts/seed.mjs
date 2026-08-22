// One-time (and re-runnable) data loader: pushes the data extracted from the
// original SafariQuote_Master_v2_9_94.html into Supabase.
//
// Usage:
//   SUPABASE_URL=https://xxx.supabase.co \
//   SUPABASE_SERVICE_ROLE_KEY=eyJ... \
//   node scripts/seed.mjs
//
// The service role key bypasses RLS -- get it from Supabase dashboard
// (Project Settings -> API -> service_role secret). NEVER put this key in
// NEXT_PUBLIC_* env vars or ship it to the browser -- it's for this
// one-off/admin script only.
//
// Safe to re-run: upserts by slug/key, so re-running after new rate-sheet
// PDFs are processed into data/extracted/LODGES.json just updates existing
// rows and inserts any new lodges.

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "data", "extracted");

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY env vars.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

function loadJSON(name) {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, `${name}.json`), "utf8"));
}

function slugify(name, usedSlugs) {
  let base = (name || "lodge")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  let slug = base;
  let i = 2;
  while (usedSlugs.has(slug)) {
    slug = `${base}_${i}`;
    i++;
  }
  usedSlugs.add(slug);
  return slug;
}

// Convert an extracted lodge record (autoSeasonFn serialized as
// "__JSFN__<source>") into the shape lib/pricing.js expects.
function toLodgeData(raw) {
  const data = { ...raw };
  if (typeof data.autoSeasonFn === "string" && data.autoSeasonFn.startsWith("__JSFN__")) {
    data.autoSeasonFnSource = data.autoSeasonFn.slice("__JSFN__".length);
  }
  delete data.autoSeasonFn;
  return data;
}

async function seedLodges() {
  const raw = loadJSON("LODGES");
  const usedSlugs = new Set();
  const rows = raw.map((l) => ({
    slug: slugify(l.name, usedSlugs),
    name: l.name,
    region: l.region || null,
    sto_disc: typeof l.stoDisc === "number" ? l.stoDisc : null,
    currency: l.currency || "NAD",
    rate_period: l.ratePeriod || null,
    activities_require_stay: !!l.activitiesRequireStay,
    agent_note: l.agentNote || null,
    data: toLodgeData(l),
  }));

  console.log(`Seeding ${rows.length} lodges...`);
  const chunkSize = 100;
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const { error } = await supabase.from("lodges").upsert(chunk, { onConflict: "slug" });
    if (error) throw error;
    console.log(`  ${Math.min(i + chunkSize, rows.length)}/${rows.length}`);
  }
}

async function seedCarHire() {
  const raw = loadJSON("CAR_HIRE_COMPANIES");
  const rows = Object.entries(raw).map(([key, data]) => ({ key, data }));
  console.log(`Seeding ${rows.length} car hire companies...`);
  const { error } = await supabase.from("car_hire_companies").upsert(rows, { onConflict: "key" });
  if (error) throw error;
}

async function seedReferenceTables() {
  const names = ["TRANSFERS", "MEET_GREET", "CURRENCIES", "FX", "SYM", "NAD_PER_UNIT"];
  const rows = names.map((name) => ({ name, data: loadJSON(name) }));
  console.log(`Seeding ${rows.length} reference tables...`);
  const { error } = await supabase.from("reference_tables").upsert(rows, { onConflict: "name" });
  if (error) throw error;
}

async function main() {
  await seedLodges();
  await seedCarHire();
  await seedReferenceTables();
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
