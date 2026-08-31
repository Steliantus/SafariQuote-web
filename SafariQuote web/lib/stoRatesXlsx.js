import ExcelJS from "exceljs";

// ============================================================================
// The "My Rates" spreadsheet — a tour operator's personal STO% override sheet
// for every lodge in the shared rate book, plus a place to flag lodges they
// use that aren't in SafariQuote yet.
//
// Design notes (see supabase/migrations/004 and 005, and app/my-rates/):
//  - "Your STO %" is pre-filled with the tenant's saved override if they have
//    one, otherwise the capped default: min(lodge's stated rate, your
//    negotiated ceiling). A lodge stated at 0% stays 0% for everyone.
//  - Activities are shown for context only (they inherit the lodge's own
//    rate/discount arrangement — see the pricing-fix writeup — there's no
//    separate per-activity rate to set here).
//  - Re-uploading writes every filled "Your STO %" row straight into
//    tenant_lodge_rates as that tenant's standing rate — this table is
//    private per-tenant RLS, so this whole flow never needs the admin/
//    service-role client, only the caller's own authenticated session.
//  - Rows on the "Add New Lodges" tab go into lodge_submissions for Ondjamba
//    to review and manually onboard — never straight into the shared lodges
//    table.
// ============================================================================

const STO_SHEET = "STO Rates";
const NEW_LODGES_SHEET = "Add New Lodges";
const INSTRUCTIONS_SHEET = "Instructions";
const EXAMPLE_LODGE_NAME = "Example Lodge (overwrite or delete this row)";
const NEW_LODGE_TEMPLATE_ROWS = 25;

const HEADER_FILL = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F2937" } };
const HEADER_FONT = { bold: true, color: { argb: "FFFFFFFF" } };
const EDIT_FILL = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF9C4" } }; // pale yellow — cells to fill in
const EXAMPLE_FONT = { italic: true, color: { argb: "FF9CA3AF" } };

function effectiveDefault(lodgeStoDisc, tenantCapPct) {
  const lodgeRate = typeof lodgeStoDisc === "number" ? lodgeStoDisc : 20;
  return Math.min(lodgeRate, tenantCapPct);
}

/**
 * Build the personalized workbook.
 * @param {Array<{id, name, region, sto_disc, activities: Array<{label}>}>} lodges
 * @param {Map<string, number>} myRates - lodge_id -> saved tenant_lodge_rates.sto_disc
 * @param {number} tenantCapPct - tenant's negotiated ceiling (tenants.sto_discount_pct)
 * @param {string} companyName
 */
export async function buildStoRatesWorkbook({ lodges, myRates, tenantCapPct, companyName }) {
  const wb = new ExcelJS.Workbook();
  wb.creator = "SafariQuote";
  wb.created = new Date();

  // ---- Instructions ---------------------------------------------------
  const info = wb.addWorksheet(INSTRUCTIONS_SHEET);
  info.columns = [{ width: 100 }];
  const lines = [
    `${companyName} — My STO Rates`,
    "",
    `The "${STO_SHEET}" tab lists every lodge in SafariQuote with your default STO% already filled in — the ` +
      "lowest of that lodge's own stated rate and your account's negotiated ceiling, so a lodge stated at 0% " +
      "stays at 0% and nothing is ever filled in higher than your ceiling.",
    "",
    'Only edit the "Your STO %" column, and only where you have a better negotiated rate with that lodge — ' +
      "leave everything else at the default that's already filled in.",
    "",
    "Activities are listed for context only — there's no separate rate to set for them.",
    "",
    `Do not edit or delete the hidden "Lodge ID" column (column A) — it's how we match your changes back to ` +
      "the right lodge when you upload this file again.",
    "",
    `Use up a lodge you work with that isn't listed? Add it on the "${NEW_LODGES_SHEET}" tab instead — it goes ` +
      "to our team to add properly (rooms, seasons, real rates) rather than straight onto your account.",
    "",
    "When you're done, save the file and upload it again on the My Rates page — it will pick up every change.",
  ];
  lines.forEach((text, i) => {
    const row = info.getRow(i + 1);
    row.getCell(1).value = text;
    row.getCell(1).alignment = { wrapText: true, vertical: "top" };
    if (i === 0) row.getCell(1).font = { bold: true, size: 14 };
  });

  // ---- STO Rates --------------------------------------------------------
  const sheet = wb.addWorksheet(STO_SHEET, { views: [{ state: "frozen", ySplit: 1 }] });
  sheet.columns = [
    { header: "Lodge ID", key: "id", width: 12 },
    { header: "Lodge Name", key: "name", width: 38 },
    { header: "Region", key: "region", width: 20 },
    { header: "Activities at this lodge (for context only)", key: "activities", width: 55 },
    { header: "Your STO %", key: "rate", width: 14 },
  ];
  sheet.getRow(1).eachCell((cell) => {
    cell.fill = HEADER_FILL;
    cell.font = HEADER_FONT;
  });
  sheet.getColumn(1).hidden = true;

  lodges.forEach((lodge) => {
    const saved = myRates.get(lodge.id);
    const value = saved != null ? saved : effectiveDefault(lodge.sto_disc, tenantCapPct);
    const activityNames = (lodge.activities || []).map((a) => a.label).filter(Boolean).join(", ");
    const row = sheet.addRow({
      id: lodge.id,
      name: lodge.name,
      region: lodge.region || "",
      activities: activityNames,
      rate: Math.round(value * 10) / 10,
    });
    const rateCell = row.getCell(5);
    rateCell.fill = EDIT_FILL;
    rateCell.numFmt = "0.0";
    rateCell.dataValidation = {
      type: "decimal",
      operator: "between",
      formulae: [0, 100],
      showErrorMessage: true,
      errorTitle: "Invalid STO %",
      error: "Enter a number between 0 and 100.",
    };
    row.getCell(4).alignment = { wrapText: true };
  });

  // ---- Add New Lodges -----------------------------------------------------
  const newSheet = wb.addWorksheet(NEW_LODGES_SHEET);
  newSheet.columns = [
    { header: "Lodge Name", key: "name", width: 38 },
    { header: "Region", key: "region", width: 20 },
    { header: "Your STO %", key: "rate", width: 14 },
    { header: "Notes (contact, why you're using it, etc.)", key: "notes", width: 45 },
  ];
  newSheet.getRow(1).eachCell((cell) => {
    cell.fill = HEADER_FILL;
    cell.font = HEADER_FONT;
  });
  const exampleRow = newSheet.addRow({
    name: EXAMPLE_LODGE_NAME,
    region: "Erongo",
    rate: 15,
    notes: "This row is just an example of the expected format — overwrite or delete it.",
  });
  exampleRow.eachCell((cell) => (cell.font = EXAMPLE_FONT));
  for (let i = 0; i < NEW_LODGE_TEMPLATE_ROWS; i++) {
    const row = newSheet.addRow({});
    [1, 2, 3, 4].forEach((c) => (row.getCell(c).fill = EDIT_FILL));
  }

  wb.views = [{ activeTab: 1 }]; // open on "STO Rates", not the instructions

  return wb;
}

/**
 * Parse an uploaded workbook back into rate edits + new-lodge submissions.
 * Returns { rateEdits: [{lodgeId, stoDisc}], newLodges: [{lodgeName, region, stoDisc, notes}], errors: [string] }
 */
export async function parseStoRatesWorkbook(buffer) {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(buffer);
  const errors = [];

  const rateEdits = [];
  const sheet = wb.getWorksheet(STO_SHEET);
  if (!sheet) {
    errors.push(`Missing "${STO_SHEET}" sheet — did you upload the right file?`);
  } else {
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // header
      const lodgeId = row.getCell(1).value;
      const rawRate = row.getCell(5).value;
      if (!lodgeId || rawRate == null || rawRate === "") return;
      const rate = Number(rawRate);
      if (Number.isNaN(rate) || rate < 0 || rate > 100) {
        errors.push(`Row ${rowNumber}: "${rawRate}" isn't a valid STO % (0–100) — skipped.`);
        return;
      }
      rateEdits.push({ lodgeId: String(lodgeId).trim(), stoDisc: rate });
    });
  }

  const newLodges = [];
  const newSheet = wb.getWorksheet(NEW_LODGES_SHEET);
  if (newSheet) {
    newSheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // header
      const name = row.getCell(1).value;
      if (!name || String(name).trim() === "" || String(name).trim() === EXAMPLE_LODGE_NAME) return;
      const region = row.getCell(2).value;
      const rawRate = row.getCell(3).value;
      const notes = row.getCell(4).value;
      const rate = rawRate == null || rawRate === "" ? null : Number(rawRate);
      if (rate != null && (Number.isNaN(rate) || rate < 0 || rate > 100)) {
        errors.push(`"${name}" (Add New Lodges, row ${rowNumber}): "${rawRate}" isn't a valid STO % — saved without a rate.`);
      }
      newLodges.push({
        lodgeName: String(name).trim(),
        region: region ? String(region).trim() : null,
        stoDisc: rate != null && !Number.isNaN(rate) ? rate : null,
        notes: notes ? String(notes).trim() : null,
      });
    });
  }

  return { rateEdits, newLodges, errors };
}

export { STO_SHEET, NEW_LODGES_SHEET, INSTRUCTIONS_SHEET, EXAMPLE_LODGE_NAME };
