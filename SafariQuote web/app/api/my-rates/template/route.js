import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildStoRatesWorkbook } from "@/lib/stoRatesXlsx";

// GET /api/my-rates/template — generate the signed-in tour operator's
// personalized STO-rates workbook. Everything here reads through the
// caller's own RLS-scoped session (no service-role client): the shared
// lodge list is readable by any authenticated user, and tenant_lodge_rates /
// tenants are already scoped to "your own row only" by policy.
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).single();
  if (!profile?.tenant_id) {
    return NextResponse.json({ error: "No tenant account on this profile" }, { status: 403 });
  }

  // is_master_rate_source may not exist yet if migration 004 hasn't run —
  // fall back gracefully rather than 500ing the whole download.
  let tenant;
  {
    const { data, error } = await supabase
      .from("tenants")
      .select("company_name, sto_discount_pct, is_master_rate_source")
      .eq("id", profile.tenant_id)
      .single();
    tenant = error
      ? (await supabase.from("tenants").select("company_name, sto_discount_pct").eq("id", profile.tenant_id).single()).data
      : data;
  }
  if (!tenant) return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
  if (tenant.is_master_rate_source) {
    return NextResponse.json(
      { error: "Your account uses each lodge's own contracted rate directly — there's no rate sheet to fill in." },
      { status: 400 }
    );
  }

  const [{ data: lodges }, { data: myRateRows }] = await Promise.all([
    supabase.from("lodges").select("id, name, region, sto_disc, activities:data->activities").order("name"),
    supabase.from("tenant_lodge_rates").select("lodge_id, sto_disc").eq("tenant_id", profile.tenant_id),
  ]);

  const myRates = new Map((myRateRows || []).map((r) => [r.lodge_id, r.sto_disc]));

  const wb = await buildStoRatesWorkbook({
    lodges: lodges || [],
    myRates,
    tenantCapPct: typeof tenant.sto_discount_pct === "number" ? tenant.sto_discount_pct : 10,
    companyName: tenant.company_name || "Your account",
  });
  const buffer = await wb.xlsx.writeBuffer();

  const filename = `SafariQuote STO Rates - ${(tenant.company_name || "tenant").replace(/[^a-z0-9]+/gi, "_")}.xlsx`;
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
