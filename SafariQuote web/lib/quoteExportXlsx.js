import ExcelJS from "exceljs";
import { fmtNAD } from "./pricing";

// ============================================================================
// The quote Excel export — internal, agent-facing: full rack + STO + margin
// breakdown for a quote, ported from SafariQuote_Master_v2_9_95.html's
// exportXLSX() (its default "full view").
//
// Deliberate simplification vs. the source file: the original writes live
// Excel formulas (SUM ranges per lodge, per-night expanded rows) so an agent
// could tweak numbers in-sheet and have totals recalculate. Here every value
// is computed once in lib/pricing.js / lib/extras.js (server or client,
// identically) and written as a literal number — one row per priced line,
// not one row per night. That trades in-sheet editability for guaranteed
// correctness (the source file's own comments flag more than one formula
// bug it had to work around — a circular SUM reference, double-counted
// group totals — that a literal-values sheet can't have). The numbers are
// exactly what SafariQuote itself computed; nothing here is a duplicate,
// error-prone re-implementation of the pricing math in spreadsheet formulas.
// ============================================================================

const HEADER_FILL = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F2937" } };
const HEADER_FONT = { bold: true, color: { argb: "FFFFFFFF" } };
const SECTION_FILL = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF3E8D8" } };
const SECTION_FONT = { bold: true, color: { argb: "FF8A5A2A" } };
const TOTAL_FONT = { bold: true, size: 12 };
const MONEY_FMT = "#,##0.00";
const PCT_FMT = "0.0%";

function fmtDateRange(firstCheckin, lastCheckout) {
  const fmtD = (iso) => {
    if (!iso) return "";
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  };
  if (!firstCheckin) return "";
  return fmtD(firstCheckin) + (lastCheckout ? " – " + fmtD(lastCheckout) : "");
}

function quoteRefCode({ clientName, quoteMode, numGuests, totalNights, firstCheckin }) {
  const surname = (clientName || "Guest").trim().split(/\s+/).pop();
  const mode = quoteMode === "trade" ? "TL" : "SD";
  const paxNights = `${numGuests}P${totalNights}D`;
  let mon = "";
  if (firstCheckin) {
    const [y, m, d] = firstCheckin.split("-").map(Number);
    mon = new Date(y, m - 1, d).toLocaleDateString("en-GB", { month: "short", year: "2-digit" }).replace(" ", "");
  }
  return [surname, mode, paxNights, mon, "001"].filter(Boolean).join("-");
}

/**
 * Build the quote's internal Excel workbook.
 * @param {object} computed - result of computeQuote(): {lines, rackTotal, stoTotal, margin, marginPct}
 * @param {object} meta - {clientName, numGuests, totalNights, firstCheckin, lastCheckout, quoteMode, companyName}
 */
export async function buildQuoteWorkbook(computed, meta) {
  const wb = new ExcelJS.Workbook();
  wb.creator = "SafariQuote";
  wb.created = new Date();

  const ws = wb.addWorksheet("Quote", { views: [{ state: "frozen", ySplit: 5 }] });
  ws.columns = [
    { width: 42 }, // Item
    { width: 34 }, // Detail
    { width: 16 }, // Rack Total
    { width: 16 }, // STO Total
    { width: 12 }, // STO Disc %
    { width: 40 }, // Notes
  ];

  const dateRange = fmtDateRange(meta.firstCheckin, meta.lastCheckout);
  const quoteRef = quoteRefCode(meta);
  const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  ws.addRow(["QUICK COSTING:", meta.clientName || "", dateRange, "", "", ""]);
  ws.mergeCells("C1:F1");
  ws.getRow(1).font = { bold: true, size: 13 };

  ws.addRow([quoteRef, `${meta.numGuests} guest(s)`, `${meta.totalNights} night(s)`, `Quote date: ${today}`, "", ""]);
  ws.getRow(2).font = { italic: true, color: { argb: "FF666666" } };

  ws.addRow([]);

  const hdrRow = ws.addRow(["Item", "Detail", "Rack Total (NAD)", "STO Total (NAD)", "STO Disc %", "Notes"]);
  hdrRow.eachCell((cell) => {
    cell.fill = HEADER_FILL;
    cell.font = HEADER_FONT;
  });

  (computed.lines || []).forEach((l) => {
    if (l.zero) return; // "No X" placeholder lines carry no data
    if (l.stopSec || l.sec) {
      const row = ws.addRow([l.label || l.sec, "", "", "", "", ""]);
      ws.mergeCells(`A${row.number}:F${row.number}`);
      row.eachCell((cell) => {
        cell.fill = SECTION_FILL;
        cell.font = SECTION_FONT;
      });
      return;
    }
    const rack = l.rack || 0;
    const sto = l.sto != null ? l.sto : rack;
    const discPct = rack > 0 ? 1 - sto / rack : null;
    const notes = l.companyNote || (l.passThru ? "NETT pass-through" : "");
    const row = ws.addRow([l.label || "", l.detail || "", rack, sto, discPct, notes]);
    row.getCell(3).numFmt = MONEY_FMT;
    row.getCell(4).numFmt = MONEY_FMT;
    if (discPct != null) row.getCell(5).numFmt = PCT_FMT;
  });

  ws.addRow([]);

  const margin = computed.margin ?? (computed.rackTotal || 0) - (computed.stoTotal || 0);
  const marginPct = computed.marginPct ?? (computed.rackTotal > 0 ? (margin / computed.rackTotal) * 100 : 0);

  const rackRow = ws.addRow(["", "", "RACK TOTAL", computed.rackTotal || 0, "", ""]);
  rackRow.getCell(4).numFmt = MONEY_FMT;
  rackRow.font = TOTAL_FONT;

  const stoRow = ws.addRow(["", "", "STO TOTAL (your cost)", computed.stoTotal || 0, "", ""]);
  stoRow.getCell(4).numFmt = MONEY_FMT;
  stoRow.font = TOTAL_FONT;

  const marginRow = ws.addRow(["", "", "MARGIN", margin, `${marginPct.toFixed(1)}%`, ""]);
  marginRow.getCell(4).numFmt = MONEY_FMT;
  marginRow.font = TOTAL_FONT;

  ws.addRow([]);
  const footer = ws.addRow([`${meta.companyName ? meta.companyName + " · " : ""}SafariQuote — internal costing sheet, not for client distribution.`]);
  footer.getCell(1).font = { italic: true, size: 9, color: { argb: "FF888888" } };

  return { wb, filename: `SafariQuote_${quoteRef}.xlsx`.replace(/\s+/g, "_") };
}

export { fmtNAD };
