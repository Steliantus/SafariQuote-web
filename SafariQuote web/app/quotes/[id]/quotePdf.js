"use client";

import { fmtNAD } from "@/lib/pricing";

// Client-facing quote PDF — ported from SafariQuote_Master_v2_9_95.html's
// generatePDF(): builds a printable HTML document in a new window and
// invokes window.print() so the visitor can "Save as PDF" from their
// browser's print dialog. Deliberately shows RACK total only (not the STO
// / margin figures) — this is the document an agent hands to their client,
// same as the source tool.
function escapeHtml(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function fmtDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function downloadQuotePdf({ computed, clientName, numGuests, stops, companyName }) {
  if (!computed || !computed.rackTotal) return;

  let firstCheckin = "",
    lastCheckout = "",
    totalNights = 0;
  (stops || []).forEach((s) => {
    if (s.checkin && (!firstCheckin || s.checkin < firstCheckin)) firstCheckin = s.checkin;
    if (s.checkout && (!lastCheckout || s.checkout > lastCheckout)) lastCheckout = s.checkout;
    if (s.checkin && s.checkout) {
      const n = Math.round((new Date(s.checkout) - new Date(s.checkin)) / 86400000);
      if (n > 0) totalNights += n;
    }
  });

  const dateRange = firstCheckin ? fmtDate(firstCheckin) + (lastCheckout ? " – " + fmtDate(lastCheckout) : "") : "";
  const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const brandLine = (companyName ? escapeHtml(companyName) + " · " : "") + "SafariQuote";

  let rows = "";
  (computed.lines || []).forEach((l) => {
    if (l.zero) return;
    if (l.stopSec) {
      rows += `<tr class="stopsec"><td colspan="2">${escapeHtml(l.label)}</td></tr>`;
      return;
    }
    if (l.sec) {
      rows += `<tr class="sec"><td colspan="2">${escapeHtml(l.sec)}</td></tr>`;
      return;
    }
    const val = !l.rack ? "" : fmtNAD(l.rack);
    const detailHtml = l.detail ? `<br><span class="detail">${escapeHtml(l.detail)}</span>` : "";
    rows += `<tr><td>${escapeHtml(l.label)}${detailHtml}</td><td class="amt">${val}</td></tr>`;
  });

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Safari Quote${clientName ? " — " + escapeHtml(clientName) : ""}</title>
<style>
@page{margin:18mm 16mm;}
body{font-family:Georgia,'Times New Roman',serif;color:#2a2a2a;margin:0;padding:24px 8px;}
h1{font-size:22px;letter-spacing:1px;margin:0 0 2px;color:#8a5a2a;}
.tag{font-size:11px;color:#888;letter-spacing:2px;text-transform:uppercase;margin-bottom:18px;}
.meta{font-size:13px;color:#555;margin-bottom:4px;}
.meta b{color:#2a2a2a;}
table{width:100%;border-collapse:collapse;margin-top:18px;font-size:13px;}
td{padding:8px 4px;border-bottom:1px solid #eee;vertical-align:top;}
td.amt{text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums;}
.detail{font-size:11px;color:#888;}
tr.sec td{font-weight:bold;padding-top:16px;border-bottom:2px solid #8a5a2a;color:#8a5a2a;}
tr.stopsec td{font-weight:bold;font-size:14px;padding-top:22px;color:#2a2a2a;}
.totalrow td{border-top:2px solid #2a2a2a;border-bottom:none;font-weight:bold;font-size:16px;padding-top:14px;}
.footer{margin-top:36px;font-size:11px;color:#888;border-top:1px solid #eee;padding-top:12px;line-height:1.6;}
@media print{ body{padding:0;} }
</style></head><body>
<h1>Safari Quote</h1>
<div class="tag">${brandLine}</div>
${clientName ? `<div class="meta"><b>Prepared for:</b> ${escapeHtml(clientName)}</div>` : ""}
<div class="meta"><b>Guests:</b> ${numGuests} &nbsp; <b>Nights:</b> ${totalNights}${dateRange ? ` &nbsp; <b>Dates:</b> ${dateRange}` : ""}</div>
<div class="meta"><b>Quote date:</b> ${today}</div>
<table><tbody>${rows}
<tr class="totalrow"><td>Total</td><td class="amt">${fmtNAD(computed.rackTotal)}</td></tr>
</tbody></table>
<div class="footer">All rates are quoted inclusive of VAT and are subject to availability at the time of booking confirmation.
<br>This quote is valid for the travel period shown above and may be revised if travel dates, guest numbers, or itinerary change.
<br><br>${brandLine}</div>
</body></html>`;

  const win = window.open("", "_blank", "width=850,height=1100");
  if (!win) {
    alert("Your browser blocked the PDF window as a pop-up. Please allow pop-ups for this page and try again.");
    return;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
  win.focus();
  // Give the new window a moment to lay out before invoking print, so
  // "Save as PDF" captures the fully-rendered page.
  setTimeout(() => win.print(), 350);
}
