// ============================================================================
// Core pricing engine — ported from SafariQuote_Master_v2_9_95.html
//
// This is a *pure*, framework-agnostic port of the accommodation/activities
// pricing math from the original single-file tool's computeAndRender(),
// getEffectiveRates(), resolveLevy() and resolveSeasonFromCheckin(). The
// original versions read form values straight out of the DOM; these versions
// take plain data objects instead, so they can run identically on the server
// (admin preview, confirm-time snapshot) and in the browser (live quote
// builder), and can be unit tested.
//
// Car hire, transfers, meet & greet, FlyNamibia sectors, and custom/extra
// line items are ported too, in lib/extras.js (computeExtras) — computeQuote
// below merges those in with the per-stop accommodation/activities lines.
// PDF and Excel export live in QuoteBuilder.js and app/api/quotes/[id]/export.
//
// NOT PORTED, and not planned: "trade mode" (direct vs. trade pricing) is
// carried through as a label/quote-reference toggle only, matching the
// source file exactly — even there, the "STO + 15% margin ÷ 0.82" trade
// formula it describes was never actually wired into any calculation, so
// there's no real behavior to port. Helicopter Horizons company-wide rates
// are also left out: same story, dead data with an explicitly "not called
// anywhere" helper in the source file, not a live feature there either.
//
// lodge shape expected here (== `lodges.data` JSONB column, plus a few
// promoted columns merged in — see lib/lodgeRecord.js):
//   { name, currency, stoDisc, levy, bedLevyPct, activitiesRequireStay,
//     mealRates, seasons:[{id,label}], rooms:[...], activities:[...],
//     autoSeasonFnSource: "<js source>" }
// ============================================================================

import { computeExtras } from "./extras";
import { CAR_HIRE_COMPANIES } from "./carHire";

const NAD_PER_UNIT_DEFAULT = {
  NAD: 1,
  USD: 16.5,
  EUR: 18.9,
  GBP: 22.0,
  ZAR: 1.0,
  BWP: 1.22,
};

// Reconstruct a lodge's per-lodge season-detection function from its stored
// source text (captured verbatim from the original codebase, see
// extract/extract.js). Falls back to null if absent/unparseable, in which
// case callers fall back to the lodge's first defined season.
export function compileAutoSeasonFn(source) {
  if (!source) return null;
  try {
    // Source is either `function name(m,d,y){...}` or `(m,d,y)=>{...}` —
    // both are valid to wrap in parens and evaluate as an expression.
    // eslint-disable-next-line no-new-func
    return new Function(`"use strict"; return (${source});`)();
  } catch (e) {
    console.error("compileAutoSeasonFn failed:", e, source);
    return null;
  }
}

export function resolveSeasonFromCheckin(lodge, checkin, autoSeasonFn) {
  const fallback = (lodge.seasons && lodge.seasons[0] && lodge.seasons[0].id) || null;
  if (!lodge || !autoSeasonFn || !checkin) return fallback;
  const dt = new Date(checkin);
  if (isNaN(dt)) return fallback;
  try {
    return autoSeasonFn(dt.getMonth() + 1, dt.getDate(), dt.getFullYear()) || fallback;
  } catch {
    return fallback;
  }
}

// Mirrors getEffectiveRates(): real season rate if present, else a +10%
// estimate off the matching 2026 base rate for *2027-labelled* seasons only.
export function getEffectiveRates(room, season, lodge) {
  if (!room || !room.rates) return null;
  if (room.rates[season]) return { ...room.rates[season], estimated: false };

  const is2027Season =
    /27$/.test(season) ||
    ["p27", "peak27", "shl27", "sec27", "shoulder27"].includes(season);
  if (!is2027Season) return null;

  const suffix27 = {
    flat27: "flat",
    low27: "low",
    high27: "high",
    green27: "green",
    shoulder27: "shoulder",
    peak27: "high",
    shl27: "high",
    sec27: "low",
    p27: "flat",
    normal27: "normal",
  };
  const base = suffix27[season] || season.replace(/27$/, "");
  const baseRates = room.rates[base] || room.rates["flat"] || null;
  if (!baseRates) return null;

  return {
    rack: Math.round(baseRates.rack * 1.1),
    sto: Math.round(baseRates.sto * 1.1),
    estimated: true,
  };
}

// Mirrors resolveLevy(): lodge.levy can be a flat number or a per-season map.
export function resolveLevy(lodge, season) {
  if (lodge == null || lodge.levy == null) return 0;
  if (typeof lodge.levy === "object") {
    if (season && lodge.levy[season] != null) return lodge.levy[season];
    const vals = Object.values(lodge.levy).filter((v) => typeof v === "number");
    return vals.length ? vals[0] : 0;
  }
  return lodge.levy;
}

export function fmtNAD(n) {
  return "N$" + Math.round(n || 0).toLocaleString("en-US");
}

/**
 * Compute one stop's accommodation + activities + meals lines.
 *
 * @param {object} stop - {
 *   lodgeId, actOnly, roomIndex, seasonId, numRooms, checkin, checkout,
 *   singleSupp, paxOverride, selectedActivityIds:[], actQty:{}, stoDiscOverride,
 *   selectedMealKeys:[], extraMeal:{type,rate}
 * }
 * @param {object} lodge - lodge record (data JSONB + name/currency/etc merged in)
 * @param {number} numGuests - itinerary-level guest count, used when the stop
 *   has no paxOverride
 * @param {object} nadPerUnit - currency conversion table (defaults to the
 *   snapshot baked into this file; pass the live reference_tables row when
 *   you have it so FX stays current)
 */
export function computeStopLines(stop, lodge, numGuests, nadPerUnit = NAD_PER_UNIT_DEFAULT) {
  const lines = [];
  let rack = 0;
  let sto = 0;
  if (!lodge) return { lines, rack, sto };

  const autoSeasonFn = compileAutoSeasonFn(lodge.autoSeasonFnSource);
  const stopPax = stop.paxOverride && stop.paxOverride > 0 ? stop.paxOverride : numGuests;
  const lodgeCur = lodge.currency && nadPerUnit[lodge.currency] ? lodge.currency : "NAD";
  const fx = nadPerUnit[lodgeCur] || 1;

  // ---- Activities-only (day visit, no room) --------------------------------
  const actOnly = !!(stop.actOnly && !lodge.activitiesRequireStay);
  if (actOnly) {
    (lodge.activities || []).forEach((a) => {
      if (!stop.selectedActivityIds?.includes(a.id) || a.rack === 0) return;
      const isFixed = ["per couple", "per day", "per vehicle", "per boat"].includes(a.unit);
      let mult;
      if (a.unit === "per couple") mult = Math.ceil(stopPax / 2);
      else if (isFixed) mult = 1;
      else {
        const qv = stop.actQty?.[a.id] !== undefined ? stop.actQty[a.id] : stopPax;
        mult = Math.max(0, qv);
      }
      if (mult === 0) return;
      const r = a.rack * mult * fx;
      const s = a.sto * mult * fx;
      rack += r;
      sto += s;
      lines.push({ label: a.label, detail: `${a.unit}${mult > 1 ? " × " + mult : ""}`, rack: r, sto: s });
    });
    return { lines, rack, sto, actOnly: true };
  }

  if (lodge.ratesPending || !lodge.rooms?.length) return { lines, rack, sto };
  const room = lodge.rooms[stop.roomIndex];
  if (!room) return { lines, rack, sto };

  const season = stop.seasonId || resolveSeasonFromCheckin(lodge, stop.checkin, autoSeasonFn) || lodge.seasons[0]?.id;
  const numRooms = Math.max(1, stop.numRooms || 1);

  let nights = 1;
  if (stop.checkin && stop.checkout) {
    const dn = (new Date(stop.checkout) - new Date(stop.checkin)) / 86400000;
    if (dn > 0) nights = Math.round(dn);
  }

  const rates = getEffectiveRates(room, season, lodge);
  if (!rates) return { lines, rack, sto };

  const isPerSuite = room.rateType === "per-suite";
  const isPerRoom = room.rateType === "per-room" || room.rateType === "per_unit";
  const rackUnit = rates.rack * fx;
  const stoUnit = rates.sto * fx;

  let rackAccom, stoAccom;
  if (isPerSuite || isPerRoom) {
    rackAccom = rackUnit * numRooms * nights;
    stoAccom = stoUnit * numRooms * nights;
  } else {
    rackAccom = rackUnit * stopPax * nights;
    stoAccom = stoUnit * stopPax * nights;
  }

  // Per-stop STO% override (only applied when it actually differs from the
  // lodge default — otherwise the loaded rack/STO pair is trusted as-is).
  const lodgeDefaultStoDisc = typeof lodge.stoDisc === "number" ? lodge.stoDisc : 20;
  if (
    stop.stoDiscOverride != null &&
    !isNaN(stop.stoDiscOverride) &&
    stop.stoDiscOverride !== lodgeDefaultStoDisc
  ) {
    stoAccom = Math.round(rackAccom * (1 - stop.stoDiscOverride / 100));
  }

  let rackLevy = 0,
    stoLevy = 0;
  const levyAmt = resolveLevy(lodge, season);
  if (levyAmt >= 20) {
    rackLevy = levyAmt * stopPax * nights;
    stoLevy = rackLevy;
  }

  let rackBedLevy = 0,
    stoBedLevy = 0;
  if (lodge.bedLevyPct > 0 && !room.bedLevyExempt) {
    rackBedLevy = rackAccom * (lodge.bedLevyPct / 100);
    stoBedLevy = stoAccom * (lodge.bedLevyPct / 100);
  }

  let singleSuppRack = 0,
    singleSuppSto = 0;
  if (stop.singleSupp && !isPerSuite && !isPerRoom) {
    if (room.singleSuppPct) {
      singleSuppRack = rackUnit * (room.singleSuppPct / 100) * nights;
      singleSuppSto = stoUnit * (room.singleSuppPct / 100) * nights;
    } else if (room.singleSuppFlat) {
      singleSuppRack = room.singleSuppFlat * nights;
      singleSuppSto = room.singleSuppFlat * nights;
    }
  }

  const rType = isPerSuite || isPerRoom ? "rm" : "pp";
  const unitStr = isPerSuite || isPerRoom ? numRooms : stopPax;
  const sLabel =
    ((lodge.seasons.find((s) => s.id === season)?.label || season).split("(")[0].trim()) +
    (rates.estimated ? " ⚠ EST" : "") +
    (fx !== 1 ? ` ⚠ FX ${lodgeCur}→NAD @${fx.toFixed(2)}` : "");

  lines.push({
    stopSec: true,
    label: `${lodge.name}  ·  ${stop.checkin || "?"}${stop.checkout ? " → " + stop.checkout : ""}  ·  ${nights}n`,
  });
  lines.push({
    label: lodge.name,
    detail: `${unitStr}${rType} × ${nights}n · ${sLabel}`,
    rackDetail: `${fmtNAD(rackUnit)}/${rType}/n`,
    stoDetail: `${fmtNAD(stoUnit)}/${rType}/n`,
    rack: rackAccom,
    sto: stoAccom,
    nights,
    checkin: stop.checkin || "",
    checkout: stop.checkout || "",
  });
  if (singleSuppRack > 0)
    lines.push({ label: "Single supplement", detail: `${nights}n`, rack: singleSuppRack, sto: singleSuppSto });
  if (rackBedLevy > 0)
    lines.push({
      label: `Bed/Tourism levy (${lodge.bedLevyPct}%)`,
      detail: `${lodge.bedLevyPct}% of room rate × ${nights}n`,
      rack: rackBedLevy,
      sto: stoBedLevy,
    });
  if (rackLevy > 0)
    lines.push({
      label: "Conservation levy",
      detail: `N$${levyAmt}/pp×${stopPax}×${nights}n`,
      rack: rackLevy,
      sto: stoLevy,
      passThru: true,
    });

  let rackActs = 0,
    stoActs = 0;
  (lodge.activities || []).forEach((a) => {
    if (!stop.selectedActivityIds?.includes(a.id) || a.rack === 0) return;
    const isFixed = ["per couple", "per day", "per vehicle", "per boat"].includes(a.unit);
    let mult;
    if (a.unit === "per couple") mult = Math.ceil(stopPax / 2);
    else if (isFixed) mult = 1;
    else {
      const qv = stop.actQty?.[a.id] !== undefined ? stop.actQty[a.id] : stopPax;
      mult = Math.max(0, qv);
    }
    if (mult === 0) return;
    const r = a.rack * mult * fx;
    const s = a.sto * mult * fx;
    rackActs += r;
    stoActs += s;
    lines.push({ label: a.label, detail: `${a.unit}${mult > 1 ? " × " + mult : ""}`, rack: r, sto: s });
  });

  let rackMeals = 0,
    stoMeals = 0;
  if (lodge.mealRates && stop.selectedMealKeys?.length) {
    const mr = lodge.mealRates;
    [
      { key: "dinner", label: "Dinner (NETT)", rate: mr.dinner || 0 },
      { key: "lunch", label: "Lunch (NETT)", rate: mr.lunch || 0 },
      { key: "breakfast", label: "Breakfast (NETT)", rate: mr.breakfast || 0 },
    ].forEach((ml) => {
      if (!stop.selectedMealKeys.includes(ml.key) || !ml.rate) return;
      const total = ml.rate * stopPax * nights;
      lines.push({
        label: ml.label,
        detail: `${fmtNAD(ml.rate)}/pp × ${stopPax}pp × ${nights}n`,
        rack: total,
        sto: total,
        passThru: true,
      });
      rackMeals += total;
      stoMeals += total;
    });
  }
  if (stop.extraMeal?.type && stop.extraMeal?.rate > 0) {
    const total = stop.extraMeal.rate * stopPax * nights;
    lines.push({
      label: `${stop.extraMeal.type} — added (NETT)`,
      detail: `${fmtNAD(stop.extraMeal.rate)}/pp × ${stopPax}pp × ${nights}n`,
      rack: total,
      sto: total,
      passThru: true,
    });
    rackMeals += total;
    stoMeals += total;
  }

  rack += rackAccom + singleSuppRack + rackLevy + rackBedLevy + rackActs + rackMeals;
  sto += stoAccom + singleSuppSto + stoLevy + stoBedLevy + stoActs + stoMeals;

  return { lines, rack, sto };
}

/**
 * Compute a full quote from its stored `stops` + `guests` + `extras`.
 * `lodgesById` must be a Map/object of lodgeId -> merged lodge record.
 * Returns { lines, rackTotal, stoTotal, margin, marginPct }.
 */
export function computeQuote(quote, lodgesById) {
  const numGuests = Math.max(1, (quote.guests || []).length);
  const allLines = [];
  let grandRack = 0;
  let grandSto = 0;

  for (const stop of quote.stops || []) {
    const lodge = lodgesById[stop.lodgeId];
    if (!lodge) continue;
    const { lines, rack, sto } = computeStopLines(stop, lodge, numGuests);
    allLines.push(...lines);
    grandRack += rack;
    grandSto += sto;
  }

  const extrasResult = computeExtras(quote.extras, quote.stops, numGuests, CAR_HIRE_COMPANIES);
  allLines.push(...extrasResult.lines);
  grandRack += extrasResult.rackTotal;
  grandSto += extrasResult.stoTotal;

  const margin = grandRack - grandSto;
  const marginPct = grandRack > 0 ? (margin / grandRack) * 100 : 0;

  return { lines: allLines, rackTotal: grandRack, stoTotal: grandSto, margin, marginPct };
}
