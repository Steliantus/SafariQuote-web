import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isDemoTenant, getDemoLodgeById } from "@/lib/demo";
import { computeQuote } from "@/lib/pricing";
import { buildQuoteWorkbook } from "@/lib/quoteExportXlsx";

// GET /api/quotes/[id]/export-xlsx — internal rack+STO+margin breakdown for
// one quote, available identically to the demo/trial tenant and every real
// tenant (see app/quotes/[id]/page.js for the same demo-vs-live lodge split
// this mirrors). A confirmed quote uses its frozen computed_snapshot, same
// as the on-screen Quote Builder; a draft quote is recomputed live from
// current lodge rates.
export async function GET(request, { params }) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).single();
  if (!profile?.tenant_id) return NextResponse.json({ error: "No tenant account on this profile" }, { status: 403 });

  const { data: quote, error: quoteErr } = await supabase.from("quotes").select("*").eq("id", id).single();
  if (quoteErr || !quote) return NextResponse.json({ error: "Quote not found" }, { status: 404 });

  const isDemo = isDemoTenant(profile.tenant_id);

  let companyName = "";
  if (!isDemo) {
    const { data: tenant } = await supabase.from("tenants").select("company_name").eq("id", profile.tenant_id).single();
    companyName = tenant?.company_name || "";
  }

  let computed;
  if (quote.status === "confirmed" && quote.computed_snapshot) {
    computed = quote.computed_snapshot;
  } else {
    const lodgeIds = [...new Set((quote.stops || []).map((s) => s.lodgeId).filter(Boolean))];
    const lodgesById = {};
    if (isDemo) {
      lodgeIds.forEach((lid) => {
        const l = getDemoLodgeById(lid);
        if (l) lodgesById[lid] = l.data;
      });
    } else if (lodgeIds.length > 0) {
      const { data: lodgeRows } = await supabase.from("lodges").select("id, data").in("id", lodgeIds);
      (lodgeRows || []).forEach((row) => {
        lodgesById[row.id] = row.data;
      });
    }
    computed = computeQuote(quote, lodgesById);
  }

  if (!computed || !computed.rackTotal) {
    return NextResponse.json({ error: "No priced stops to export." }, { status: 400 });
  }

  let firstCheckin = "",
    lastCheckout = "",
    totalNights = 0;
  (quote.stops || []).forEach((s) => {
    if (s.checkin && (!firstCheckin || s.checkin < firstCheckin)) firstCheckin = s.checkin;
    if (s.checkout && (!lastCheckout || s.checkout > lastCheckout)) lastCheckout = s.checkout;
    if (s.checkin && s.checkout) {
      const n = Math.round((new Date(s.checkout) - new Date(s.checkin)) / 86400000);
      if (n > 0) totalNights += n;
    }
  });

  const { wb, filename } = await buildQuoteWorkbook(computed, {
    clientName: quote.client_name,
    numGuests: Math.max(1, (quote.guests || []).length),
    totalNights,
    firstCheckin,
    lastCheckout,
    quoteMode: quote.extras?.quoteMode || "direct",
    companyName,
  });

  const buffer = await wb.xlsx.writeBuffer();
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
