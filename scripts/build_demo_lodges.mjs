// Builds the frozen "trial" demo dataset used by the public /trial route.
//
// Source: data/extracted/LODGES.json (the original 613-lodge extraction).
// This is deliberately NOT read from the live `lodges` Supabase table --
// the trial must never change when real rates are refreshed, and must never
// show a not-yet-public future rate cycle. It is a static, versioned
// snapshot checked into the repo.
//
// Transform, for every lodge:
//   - Drop any season / rate-key tagged for a later year (id ending "27",
//     or a label mentioning "2027") -- keeps only 2026 (or year-agnostic
//     month-based) rates, per the "trial shows 2026 rates only" requirement.
//   - Force EVERY sto figure (rooms + activities) to round(rack * 0.9) --
//     a flat 10% STO across the board, per "all sto rates set at 10%",
//     regardless of what the real sheet's discount was.
//   - Strip Dana-only private commercial notes (agentNote/actNote/offers) --
//     these are never rendered in the tenant quote builder anyway, but they
//     can contain confidential sourcing/negotiation detail that has no
//     business being in a public-facing trial payload.
//   - Assign each lodge a stable synthetic `id` (deterministic from its
//     name) so quotes saved during a trial session keep working the same
//     way a real lodges.id would.
//
// Usage: node scripts/build_demo_lodges.mjs
// Output: data/demo/DEMO_LODGES_2026.json

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, "..", "data", "extracted", "LODGES.json");
const OUT_DIR = path.join(__dirname, "..", "data", "demo");
const OUT = path.join(OUT_DIR, "DEMO_LODGES_2026.json");

const is27ish = (id) => typeof id === "string" && /27$/.test(id);
const is2027Label = (label) => typeof label === "string" && /2027/.test(label);

function stableId(name, index) {
  // Deterministic v4-shaped id derived from the lodge name, so re-running
  // this script produces the same ids every time (stable across rebuilds).
  const hash = crypto.createHash("sha256").update(`safariquote-trial:${name}:${index}`).digest("hex");
  return [
    hash.slice(0, 8),
    hash.slice(8, 12),
    "4" + hash.slice(13, 16),
    ((parseInt(hash[16], 16) & 0x3) | 0x8).toString(16) + hash.slice(17, 20),
    hash.slice(20, 32),
  ].join("-");
}

function round1(n) {
  return Math.round(n);
}

function transformLodge(raw, index) {
  const seasons = (raw.seasons || []).filter((s) => !is27ish(s.id) && !is2027Label(s.label));
  const keptSeasonIds = new Set(seasons.map((s) => s.id));

  const rooms = (raw.rooms || []).map((room) => {
    const rates = {};
    for (const [seasonId, rate] of Object.entries(room.rates || {})) {
      if (is27ish(seasonId)) continue;
      if (keptSeasonIds.size > 0 && !keptSeasonIds.has(seasonId)) continue;
      const rack = rate.rack;
      rates[seasonId] = { rack, sto: round1(rack * 0.9) };
    }
    return { ...room, rates };
  });

  const activities = (raw.activities || []).map((a) => ({
    ...a,
    sto: a.rack === 0 ? 0 : round1(a.rack * 0.9),
    note: undefined, // may reference the real lodge's real discount/season pricing -- drop for the demo
  }));

  let levy = raw.levy;
  if (levy && typeof levy === "object") {
    const filtered = {};
    for (const [seasonId, v] of Object.entries(levy)) {
      if (is27ish(seasonId)) continue;
      if (keptSeasonIds.size > 0 && !keptSeasonIds.has(seasonId)) continue;
      filtered[seasonId] = v;
    }
    levy = filtered;
  }

  return {
    id: stableId(raw.name, index),
    name: raw.name,
    region: raw.region || null,
    currency: raw.currency || "NAD",
    stoDisc: 10,
    ratePeriod: "2026 Season — Trial Demo (frozen)",
    rateType: raw.rateType,
    activitiesRequireStay: !!raw.activitiesRequireStay,
    bedLevyPct: raw.bedLevyPct,
    levy,
    mealPlan: raw.mealPlan,
    childPolicy: raw.childPolicy,
    seasons,
    rooms,
    activities,
    autoSeasonFnSource: raw.autoSeasonFnSource,
    // Deliberately omitted: agentNote, actNote, offers, ratingsData -- Dana-only
    // commercial notes, never rendered in the tenant quote builder, and not
    // appropriate to ship in a public trial payload.
  };
}

function main() {
  const raw = JSON.parse(fs.readFileSync(SRC, "utf8"));
  const out = raw.map(transformLodge).filter((l) => l.rooms.some((r) => Object.keys(r.rates).length > 0) || l.activities.length > 0);
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out));
  console.log(`Wrote ${out.length} demo lodges (of ${raw.length} source) to ${path.relative(process.cwd(), OUT)}`);
  const bytes = fs.statSync(OUT).size;
  console.log(`Size: ${(bytes / 1024 / 1024).toFixed(2)} MB`);
}

main();
