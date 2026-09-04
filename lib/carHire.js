// ============================================================================
// Car hire pricing — ported from SafariQuote_Master_v2_9_95.html
// (calcCarHire, carGetSeason, carGetTier, carSeasonLabel). Pure functions,
// safe to run on the server or in the browser. Rate data lives in
// carHireRates.js (extracted verbatim from the same source file).
// ============================================================================

import { CAR_HIRE_COMPANIES } from "./carHireRates";

const NAD_PER_UNIT = {
  NAD: 1,
  USD: 16.5,
  EUR: 18.9,
  GBP: 22.0,
  ZAR: 1.0,
  BWP: 1.22,
};

// Helper: get day-tier key for a company given number of days.
// `season` is optional and only consulted by companies whose tier
// boundaries actually vary by season (currently just TAB) — every other
// company ignores it and keeps its existing days-only behavior.
export function carGetTier(companyKey, days, season) {
  if (companyKey === "NTS") return days <= 14 ? "d1_14" : "d15p";
  if (companyKey === "NRCR") return days <= 15 ? "d1_15" : "d16p";
  if (companyKey === "BRITZ") return days <= 5 ? "d0_5" : "d5p";
  if (companyKey === "N2GO") return days <= 14 ? "d1_14" : "d15p";
  // AES uses the same d1_14 / d15p tier keys as NTS/N2GO — the source master
  // file never actually added a case for AES here (verified: its rate table
  // gives d1_14 and d15p the same figures, so the gap was silently harmless
  // there), but we add the correct 14-day boundary here rather than carry
  // the gap forward, since a future AES rate update could easily make the
  // two tiers differ.
  if (companyKey === "AES") return days <= 14 ? "d1_14" : "d15p";
  if (companyKey === "MCR") {
    if (days <= 7) return "d3_7";
    if (days <= 14) return "d8_14";
    return "d15p";
  }
  if (companyKey === "BUSHLORE") {
    if (days <= 15) return "d8_15";
    if (days <= 24) return "d16_24";
    return "d25p";
  }
  if (companyKey === "TAB") {
    // Tier day-boundaries differ by season on TAB's actual rate sheet —
    // Green/Mid Peak use 5–14 / 15+, Shoulder uses 5–10 / 11–20 / 21+,
    // Peak uses 7–20 / 21+. Confirmed from the source PDF, not a guess.
    if (season === "shoulder") {
      if (days <= 10) return "d5_10";
      if (days <= 20) return "d11_20";
      return "d21p";
    }
    if (season === "peak") {
      if (days <= 20) return "d7_20";
      return "d21p";
    }
    // green, midpeak
    if (days <= 14) return "d5_14";
    return "d15p";
  }
  return "d1_14";
}

// Helper: season label for display
export function carSeasonLabel(companyKey, season) {
  if (companyKey === "MCR") {
    const labels = {
      s1: "Mar–May (pre-2027/28 sheet)",
      s2: "Jun (pre-2027/28 sheet)",
      s3: "Jul–Aug Peak (pre-2027/28 sheet)",
      s4: "Sep–Nov (pre-2027/28 sheet)",
      s5: "Nov–Mar Low (pre-2027/28 sheet)",
      s27_1: "15 Mar–14 Jul 2027",
      s27_2: "15 Jul–31 Aug 2027 (Peak)",
      s27_3: "1 Sep–14 Nov 2027",
      s27_4: "15 Nov 2027–14 Mar 2028",
    };
    return labels[season] || season;
  }
  if (companyKey === "BUSHLORE") {
    const labels = { s1: "Low", s2: "Medium", s3: "High", s4: "Peak" };
    return labels[season] || season;
  }
  if (companyKey === "TAB") {
    const labels = {
      green: "Green (Feb–Mar)",
      shoulder: "Shoulder (Apr–May, Dec–Jan)",
      midpeak: "Mid Peak (Jun–Jul, Nov)",
      peak: "Peak (Aug–Oct)",
    };
    return labels[season] || season;
  }
  return season === "high" ? "High" : "Low";
}

// Helper: get season key for a company given a date string
export function carGetSeason(companyKey, dateStr) {
  if (!dateStr) return "low";
  const dt = new Date(dateStr);
  const m = dt.getMonth() + 1,
    d = dt.getDate();
  if (companyKey === "MCR") {
    // Confirmed 2027/28 rate sheet: 15 Mar 2027 – 14 Mar 2028, 4 seasons.
    const dnum = dt.getFullYear() * 10000 + m * 100 + d;
    if (dnum >= 20270315 && dnum <= 20280314) {
      if ((m === 3 && d >= 15) || m === 4 || m === 5 || m === 6 || (m === 7 && d <= 14)) return "s27_1"; // 15Mar–14Jul27
      if ((m === 7 && d >= 15) || m === 8) return "s27_2"; // 15Jul–31Aug27
      if (m === 9 || m === 10 || (m === 11 && d <= 14)) return "s27_3"; // 1Sep–14Nov27
      return "s27_4"; // 15Nov27–14Mar28
    }
    // Legacy 5-season structure (rates valid before 15 Mar 2027)
    if ((m === 3 && d >= 15) || m === 4 || m === 5) return "s1";
    if (m === 6) return "s2";
    if (m === 7 || m === 8) return "s3";
    if (m === 9 || m === 10 || (m === 11 && d <= 14)) return "s4";
    return "s5"; // 15Nov-14Mar
  }
  if (companyKey === "BUSHLORE") {
    // Namibia 2027 calendar: s1=Low, s2=Medium, s3=High, s4=Peak.
    if (m === 1 && d <= 4) return "s2"; // 01–04 Jan: Medium
    if ((m === 1 && d >= 5) || m === 2 || (m === 3 && d <= 19)) return "s1"; // 05 Jan–19 Mar: Low
    if ((m === 3 && d >= 20) || m === 4 || m === 5 || m === 6) return "s2"; // 20 Mar–30 Jun: Medium
    if (m === 7 && d <= 19) return "s3"; // 01–19 Jul: High
    if ((m === 7 && d >= 20) || (m === 8 && d <= 15)) return "s4"; // 20 Jul–15 Aug: Peak
    if ((m === 8 && d >= 16) || m === 9 || m === 10 || (m === 11 && d <= 10)) return "s3"; // 16 Aug–10 Nov: High
    return "s2"; // 11 Nov–31 Dec: Medium
  }
  if (companyKey === "TAB") {
    // Confirmed 2027/28 rate sheet: 1 Feb 2027 – 31 Jan 2028, 4 seasons.
    const dnum = dt.getFullYear() * 10000 + m * 100 + d;
    if (dnum >= 20261201 && dnum <= 20270131) return "shoulder"; // 1 Dec 2026 – 31 Jan 2027
    if (dnum >= 20270201 && dnum <= 20270331) return "green"; // 1 Feb – 31 Mar 2027
    if (dnum >= 20270401 && dnum <= 20270531) return "shoulder"; // 1 Apr – 31 May 2027
    if (dnum >= 20270601 && dnum <= 20270731) return "midpeak"; // 1 Jun – 31 Jul 2027
    if (dnum >= 20270801 && dnum <= 20271031) return "peak"; // 1 Aug – 31 Oct 2027
    if (dnum >= 20271101 && dnum <= 20271130) return "midpeak"; // 1 – 30 Nov 2027
    if (dnum >= 20271201 && dnum <= 20280131) return "shoulder"; // 1 Dec 2027 – 31 Jan 2028
    // Outside the confirmed rate-sheet window — placeholder only, flag for
    // the agent to reconfirm with TAB rather than trust for a real quote.
    return "shoulder";
  }
  // All others: high = Jul-Oct (NTS/NRCR: Jul-Dec; N2GO/Britz/AES: Jul-Oct)
  if (companyKey === "NTS" || companyKey === "NRCR") {
    return m >= 7 && m <= 12 ? "high" : "low";
  }
  return m >= 7 && m <= 10 ? "high" : "low";
}

/**
 * Compute car hire rack & STO for a given hire card.
 * Rental days are counted inclusively — both the pick-up calendar day and
 * the drop-off calendar day are full rental days (standard self-drive
 * convention), regardless of pick-up/drop-off time.
 */
export function calcCarHire(companyKey, vehicleId, pickupDate, dropoffDate) {
  const co = CAR_HIRE_COMPANIES[companyKey];
  if (!co) return null;
  const veh = co.vehicles.find((v) => v.id === vehicleId);
  if (!veh) return null;
  if (!pickupDate || !dropoffDate) return null;
  const baseDays = Math.round((new Date(dropoffDate) - new Date(pickupDate)) / 86400000);
  const days = baseDays + 1;
  if (days <= 0) return null;
  const season = carGetSeason(companyKey, pickupDate);
  const tier = carGetTier(companyKey, days, season);
  const r = veh.rates[season] ? veh.rates[season][tier] : null;
  if (!r) return null;
  const coCur = co.currency && NAD_PER_UNIT[co.currency] ? co.currency : "NAD";
  const fx = NAD_PER_UNIT[coCur] || 1;
  return {
    rack: r.rack * days * fx,
    sto: r.sto * days * fx,
    rackDay: r.rack * fx,
    stoDay: r.sto * fx,
    days,
    season,
    tier,
    veh,
    fxRate: fx,
    fxCur: coCur,
  };
}

export { CAR_HIRE_COMPANIES };
