// ============================================================================
// Itinerary "extras" pricing — car hire, FlyNamibia sectors, meet & greet,
// ground transfers, guide accommodation, park fees, water, and free-form
// extra line items. Ported from SafariQuote_Master_v2_9_95.html's
// computeAndRender() (the sections after the per-lodge stop loop) and its
// buildCarHireLines / buildStandaloneCarHireLines / getFNSectors /
// getCustomExtras / collectTransferLineItems helpers.
//
// One deliberate consolidation vs. the source file: the master tool has
// THREE separate "add a free-form row" UIs that do almost the same job
// (Standalone Activities & Transfers: desc+date+qty+unit+rack+sto;
// Transfer Line Items: desc+pax+rack pp+sto pp; Custom Extras: desc+rack+sto
// flat). Here they're a single `extraLineItems` type with qty+unit, which
// covers all three cases (a flat custom extra is qty:1, unit:"lump sum"; a
// per-pax transfer is qty:<pax>, unit:"pp"). Nothing that could be priced in
// the original three sections is unrepresentable in this one.
//
// Everything here is a pure function of the `extras` object stored in
// quotes.extras (jsonb) plus the quote's stops — safe to run identically on
// the server (export routes) and in the browser (live quote builder).
// ============================================================================

import { calcCarHire } from "./carHire";

// ---- Fixed-rate lookup tables --------------------------------------------

export const MEET_GREET = {
  eros_std: { rack: 984, sto: 911, label: "Meet & greet Eros Airport (standard)" },
  hki_std: { rack: 1787, sto: 1653, label: "Meet & greet HKI (standard)" },
  eros_sd: { rack: 1967, sto: 1820, label: "Meet & greet Eros Airport (self-drive)" },
  hki_sd: { rack: 3575, sto: 3307, label: "Meet & greet HKI (self-drive)" },
};

// FlyNamibia Safari Circuit — all rates NAD, effective 01 May – 30 Nov 2026,
// min 2 pax per sector. Source: FN_Safari_STO_20_rates_2026.pdf.
export const FN_RATES = {
  "Windhoek|Sossusvlei": { rack: 8449, sto: 6759 },
  "Windhoek|Zannier Sonop": { rack: 10918, sto: 8734 },
  "Sossusvlei|Swakopmund": { rack: 10768, sto: 8614 },
  "Sossusvlei|Twyfelfontein": { rack: 16383, sto: 13106 },
  "Sossusvlei|Ongava": { rack: 18882, sto: 15106 },
  "Sossusvlei|Mokuti": { rack: 20376, sto: 16301 },
  "Swakopmund|Twyfelfontein": { rack: 8475, sto: 6780 },
  "Swakopmund|Ongava": { rack: 14426, sto: 11541 },
  "Swakopmund|Mokuti": { rack: 16383, sto: 13106 },
  "Swakopmund|Windhoek": { rack: 13756, sto: 11005 },
  "Twyfelfontein|Ongava": { rack: 8475, sto: 6780 },
  "Twyfelfontein|Mokuti": { rack: 10407, sto: 8326 },
  "Twyfelfontein|Windhoek": { rack: 13756, sto: 11005 },
  "Ongava|Mokuti": { rack: 8449, sto: 6759 },
  "Ongava|Windhoek": { rack: 16383, sto: 13106 },
  "Mokuti|Windhoek": { rack: 14426, sto: 11541 },
};
export const FN_STOPS = ["Windhoek", "Sossusvlei", "Swakopmund", "Twyfelfontein", "Ongava (Etosha South)", "Mokuti (Etosha East)", "Zannier Sonop"];
// Map display names to FN_RATES lookup keys
export const FN_KEY = {
  Windhoek: "Windhoek",
  Sossusvlei: "Sossusvlei",
  Swakopmund: "Swakopmund",
  Twyfelfontein: "Twyfelfontein",
  "Ongava (Etosha South)": "Ongava",
  "Mokuti (Etosha East)": "Mokuti",
  "Zannier Sonop": "Zannier Sonop",
};

export function fnLookupRate(from, to) {
  if (!from || !to || from === to) return null;
  const key = `${FN_KEY[from] || from}|${FN_KEY[to] || to}`;
  return FN_RATES[key] || null;
}

// ---- Line builders --------------------------------------------------------

function carHireLine(entry, calc) {
  const seasonLabel = calc.season === "high" ? "High" : "Low";
  const rDay = entry.overrideRack != null ? entry.overrideRack : calc.rackDay;
  const sDay = entry.overrideSto != null ? entry.overrideSto : calc.stoDay;
  const rack = rDay * calc.days;
  const sto = sDay * calc.days;
  return { rDay, sDay, rack, sto, seasonLabel };
}

// Car hire attached directly to a lodge stop (stop.carHire).
export function computeStopCarHireLine(stop, companies) {
  const ch = stop && stop.carHire;
  if (!ch || !ch.companyKey || !ch.vehicleId) return null;
  const calc = calcCarHire(ch.companyKey, ch.vehicleId, ch.pickupDate, ch.dropoffDate);
  if (!calc) return null;
  const co = companies[ch.companyKey];
  const { rDay, rack, sto, seasonLabel } = carHireLine(ch, calc);
  return {
    label: `${co.name} — ${calc.veh.label}`,
    detail: `${calc.days} day(s) · ${seasonLabel} season · N$${Math.round(rDay).toLocaleString()}/day`,
    rack,
    sto,
    carHire: true,
    pickupDate: ch.pickupDate,
    dropoffDate: ch.dropoffDate,
    companyNote: co.note,
  };
}

// Standalone car hire (not attached to a lodge stop) — itinerary-level,
// e.g. a self-drive leg before/after the lodge circuit.
export function computeStandaloneCarHireLines(entries, companies) {
  const lines = [];
  let rackTotal = 0,
    stoTotal = 0;
  (entries || []).forEach((sc) => {
    if (!sc.companyKey || !sc.vehicleId) return;
    const calc = calcCarHire(sc.companyKey, sc.vehicleId, sc.pickupDate, sc.dropoffDate);
    if (!calc) return;
    const co = companies[sc.companyKey];
    const { rDay, rack, sto, seasonLabel } = carHireLine(sc, calc);
    const owRack = sc.oneWayRack || 0;
    const owSto = sc.oneWaySto || 0;
    const totalRack = rack + owRack;
    const totalSto = sto + owSto;
    const owLabel = owRack > 0 || owSto > 0 ? ` + one-way fee N$${owRack.toLocaleString()}` : "";
    lines.push({
      label: `${co.name} — ${calc.veh.label}`,
      detail: `${calc.days} day(s) · ${seasonLabel} season · N$${Math.round(rDay).toLocaleString()}/day${owLabel}`,
      rack: totalRack,
      sto: totalSto,
      carHire: true,
      pickupDate: sc.pickupDate,
      dropoffDate: sc.dropoffDate,
      companyNote: co.note,
    });
    rackTotal += totalRack;
    stoTotal += totalSto;
  });
  return { lines, rackTotal, stoTotal };
}

// FlyNamibia Safari Circuit flight sectors — priced per person.
export function computeFnSectorLines(entries, numGuests) {
  const lines = [];
  let rackTotal = 0,
    stoTotal = 0;
  (entries || []).forEach((s) => {
    if (!s.from || !s.to || s.from === s.to) return;
    const looked = fnLookupRate(s.from, s.to);
    const rackPp = s.rackOverride != null ? s.rackOverride : looked?.rack || 0;
    const stoPp = s.stoOverride != null ? s.stoOverride : looked?.sto || 0;
    if (rackPp <= 0) return;
    const rack = rackPp * numGuests;
    const sto = stoPp * numGuests;
    lines.push({ label: `FlyNamibia: ${s.from} → ${s.to}`, detail: `${numGuests}pp`, rack, sto });
    rackTotal += rack;
    stoTotal += sto;
  });
  return { lines, rackTotal, stoTotal };
}

// Consolidated free-form extra line items (replaces the source file's three
// near-duplicate "standalone activity / transfer line / custom extra" UIs —
// see file header). qty defaults to 1, unit defaults to "lump sum"; sto
// defaults to rack (NETT pass-through) when left blank.
export function computeExtraLineItems(entries) {
  const lines = [];
  let rackTotal = 0,
    stoTotal = 0;
  (entries || []).forEach((e) => {
    const label = (e.description || "").trim();
    const rackUnit = +e.rack || 0;
    if (!label || rackUnit <= 0) return;
    const stoUnit = e.sto != null && e.sto !== "" ? +e.sto : rackUnit;
    const qty = Math.max(1, +e.qty || 1);
    const unit = e.unit || "lump sum";
    const rack = unit === "lump sum" ? rackUnit : rackUnit * qty;
    const sto = unit === "lump sum" ? stoUnit : stoUnit * qty;
    const isNett = stoUnit === rackUnit;
    lines.push({
      label,
      detail: unit === "lump sum" ? (e.date ? e.date : undefined) : `${qty} × ${unit}${e.date ? " · " + e.date : ""}`,
      rack,
      sto,
      passThru: isNett,
    });
    rackTotal += rack;
    stoTotal += sto;
  });
  return { lines, rackTotal, stoTotal };
}

/**
 * Compute every "extras" line (everything that isn't a lodge stop's own
 * accommodation/activities): per-stop car hire, standalone car hire, ground
 * handling & transfers (meet & greet, FlyNamibia sectors, misc transfer
 * amounts), and itinerary extras (guide accommodation, park fees, water,
 * free-form extra line items).
 *
 * @param {object} extras - the quote's `extras` jsonb column, see
 *   lib/quoteExtrasDefaults.js for the full shape.
 * @param {Array} stops - the quote's stops (read for any per-stop carHire).
 * @param {number} numGuests
 * @param {object} companies - CAR_HIRE_COMPANIES (passed in so callers using
 *   demo data can still resolve company names without a second import).
 */
export function computeExtras(extras, stops, numGuests, companies) {
  const e = extras || {};
  const sections = [];

  const stopCarLines = [];
  let stopCarRack = 0,
    stopCarSto = 0;
  (stops || []).forEach((stop) => {
    const line = computeStopCarHireLine(stop, companies);
    if (!line) return;
    stopCarLines.push(line);
    stopCarRack += line.rack;
    stopCarSto += line.sto;
  });

  const standalone = computeStandaloneCarHireLines(e.standaloneCarHires, companies);
  if (standalone.lines.length > 0) {
    sections.push({ sec: "Car Hire (Standalone)", lines: standalone.lines, rack: standalone.rackTotal, sto: standalone.stoTotal });
  }
  if (stopCarLines.length > 0) {
    sections.push({ sec: "Car Hire", lines: stopCarLines, rack: stopCarRack, sto: stopCarSto });
  }

  // Ground Handling & Transfers
  {
    const lines = [];
    let rack = 0,
      sto = 0;
    const mg = e.meetGreetKey && e.meetGreetKey !== "0" ? MEET_GREET[e.meetGreetKey] : null;
    if (mg) {
      lines.push({ label: mg.label, detail: "per group", rack: mg.rack, sto: mg.sto });
      rack += mg.rack;
      sto += mg.sto;
    }
    const extraT = +e.extraTransfer || 0;
    if (extraT > 0) {
      lines.push({ label: "Extra transfers / misc", rack: extraT, sto: extraT, passThru: true });
      rack += extraT;
      sto += extraT;
    }
    const go2T = +e.go2Extra || 0;
    if (go2T > 0) {
      lines.push({ label: "Go2 Namibia transfer", rack: go2T, sto: go2T, passThru: true });
      rack += go2T;
      sto += go2T;
    }
    const capriviT = +e.capriviExtra || 0;
    if (capriviT > 0) {
      lines.push({ label: "Caprivi Adventures transfer", rack: capriviT, sto: capriviT, passThru: true });
      rack += capriviT;
      sto += capriviT;
    }
    const fn = computeFnSectorLines(e.fnSectors, numGuests);
    lines.push(...fn.lines);
    rack += fn.rackTotal;
    sto += fn.stoTotal;
    if (lines.length === 0) lines.push({ label: "No ground handling / transfers", zero: true });
    sections.push({ sec: "Ground Handling & Transfers", lines, rack, sto });
  }

  // Itinerary Extras
  {
    const lines = [];
    let rack = 0,
      sto = 0;
    const guideNights = +e.guideNights || 0;
    const guideRack = +e.guideRack || 0;
    if (guideNights > 0 && guideRack > 0) {
      const gr = guideRack * guideNights;
      const gs = (e.guideSto || guideRack) * guideNights;
      lines.push({ label: "Freelance guide accommodation", detail: `${guideNights}n`, rack: gr, sto: gs, passThru: true });
      rack += gr;
      sto += gs;
    }
    const parkF = +e.parkFees || 0;
    if (parkF > 0) {
      lines.push({ label: "Park / conservation fees", rack: parkF, sto: parkF, passThru: true });
      rack += parkF;
      sto += parkF;
    }
    const waterC = +e.waterCost || 0;
    if (waterC > 0) {
      lines.push({ label: "Drinking water (enroute)", rack: waterC, sto: waterC, passThru: true });
      rack += waterC;
      sto += waterC;
    }
    const extraItems = computeExtraLineItems(e.extraLineItems);
    lines.push(...extraItems.lines);
    rack += extraItems.rackTotal;
    sto += extraItems.stoTotal;
    if (lines.length === 0) lines.push({ label: "No itinerary extras", zero: true });
    sections.push({ sec: "Itinerary Extras", lines, rack, sto });
  }

  const allLines = [];
  let rackTotal = stopCarRack + standalone.rackTotal;
  let stoTotal = stopCarSto + standalone.stoTotal;
  sections.forEach((s) => {
    allLines.push({ sec: s.sec });
    allLines.push(...s.lines);
  });
  sections.forEach((s) => {
    if (s.sec === "Car Hire (Standalone)" || s.sec === "Car Hire") return; // already counted above
    rackTotal += s.rack;
    stoTotal += s.sto;
  });

  return { lines: allLines, rackTotal, stoTotal };
}

// Default shape for a brand-new quote's `extras` column.
export function emptyExtras() {
  return {
    quoteMode: "direct", // 'direct' | 'trade' — label only, see computeQuote note
    standaloneCarHires: [],
    fnSectors: [],
    meetGreetKey: "0",
    extraTransfer: 0,
    go2Extra: 0,
    capriviExtra: 0,
    guideNights: 0,
    guideRack: 0,
    guideSto: 0,
    parkFees: 0,
    waterCost: 0,
    extraLineItems: [],
  };
}
