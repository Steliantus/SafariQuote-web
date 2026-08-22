import { computeQuote } from "../pricing.js";
import fs from "fs";

const raw = JSON.parse(fs.readFileSync("/home/claude/safariquote/extract/LODGES.json", "utf8"));

// Adapter: mirror how a DB row's `data` JSONB would be merged into a lodge
// record for the pricing engine (autoSeasonFn source string, prefix stripped).
function toLodgeRecord(l) {
  const rec = { ...l };
  if (typeof rec.autoSeasonFn === "string" && rec.autoSeasonFn.startsWith("__JSFN__")) {
    rec.autoSeasonFnSource = rec.autoSeasonFn.slice("__JSFN__".length);
  }
  delete rec.autoSeasonFn;
  return rec;
}

const abenab = raw.find((l) => l.name === "Abenab Lodge");
if (!abenab) throw new Error("Abenab Lodge not found in extracted data");

const lodge = toLodgeRecord(abenab);
const dblRoomIdx = lodge.rooms.findIndex((r) => r.id === "dbl_bb");
console.log("dbl_bb room index:", dblRoomIdx, lodge.rooms[dblRoomIdx]);

const lodgesById = { abenab: lodge };
const quote = {
  guests: [{ name: "A" }, { name: "B" }],
  stops: [
    {
      lodgeId: "abenab",
      roomIndex: dblRoomIdx,
      checkin: "2026-06-10",
      checkout: "2026-06-12", // 2 nights
      numRooms: 1,
    },
  ],
};

const result = computeQuote(quote, lodgesById);
console.log(JSON.stringify(result, null, 2));

// Expected: dbl_bb rack=950, sto=808, pp/night. 2 guests x 2 nights.
const expectedRack = 950 * 2 * 2;
const expectedSto = 808 * 2 * 2;
console.log("expected rack", expectedRack, "expected sto", expectedSto);
if (result.rackTotal !== expectedRack || result.stoTotal !== expectedSto) {
  console.error("MISMATCH");
  process.exit(1);
} else {
  console.log("OK — matches hand-calculated expectation");
}
