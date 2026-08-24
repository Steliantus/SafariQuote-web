import { computeStopLines, resolveSeasonFromCheckin, compileAutoSeasonFn } from "../pricing.js";
import fs from "fs";

const raw = JSON.parse(fs.readFileSync("/home/claude/safariquote/extract/LODGES.json", "utf8"));
function toLodgeRecord(l) {
  const rec = { ...l };
  if (typeof rec.autoSeasonFn === "string" && rec.autoSeasonFn.startsWith("__JSFN__")) {
    rec.autoSeasonFnSource = rec.autoSeasonFn.slice("__JSFN__".length);
  }
  delete rec.autoSeasonFn;
  return rec;
}

const agama = toLodgeRecord(raw.find((l) => l.name === "Agama Lodge"));
const fn = compileAutoSeasonFn(agama.autoSeasonFnSource);
console.log("June (high season expected):", resolveSeasonFromCheckin(agama, "2026-06-15", fn));
console.log("Jan (low season expected):", resolveSeasonFromCheckin(agama, "2026-01-15", fn));
console.log("seasons available:", agama.seasons.map(s=>s.id));

// activities-only smoke test using whichever lodge has activities + rack>0
const withActs = raw.map(toLodgeRecord).find(l => (l.activities||[]).some(a=>a.rack>0));
console.log("\nLodge with activities:", withActs.name, withActs.activities.filter(a=>a.rack>0)[0]);
const act = withActs.activities.filter(a=>a.rack>0)[0];
const stop = { lodgeId: "x", actOnly: true, checkin:"2026-05-01", selectedActivityIds:[act.id] };
const lodgesById = { x: withActs };
const res = computeStopLines(stop, withActs, 2);
console.log(JSON.stringify(res, null, 2));
