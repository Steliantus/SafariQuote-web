import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseStoRatesWorkbook } from "@/lib/stoRatesXlsx";

// POST /api/my-rates/upload — parse a re-uploaded STO-rates workbook and
// save it. Runs entirely through the caller's own RLS-scoped session (no
// service-role client), so a tenant can only ever write their own
// tenant_lodge_rates / lodge_submissions rows -- the database enforces that,
// this route doesn't have to.
export async function POST(request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).single();
  if (!profile?.tenant_id) {
    return NextResponse.json({ error: "No tenant account on this profile" }, { status: 403 });
  }

  const arrayBuffer = await request.arrayBuffer();
  if (!arrayBuffer.byteLength) {
    return NextResponse.json({ error: "No file received" }, { status: 400 });
  }

  let parsed;
  try {
    parsed = await parseStoRatesWorkbook(Buffer.from(arrayBuffer));
  } catch (e) {
    return NextResponse.json({ error: `Could not read that file as an Excel workbook: ${e.message}` }, { status: 400 });
  }

  const { rateEdits, newLodges, errors } = parsed;
  const tenantId = profile.tenant_id;

  let ratesSaved = 0;
  if (rateEdits.length) {
    const rows = rateEdits.map((r) => ({ tenant_id: tenantId, lodge_id: r.lodgeId, sto_disc: r.stoDisc }));
    const { error, count } = await supabase
      .from("tenant_lodge_rates")
      .upsert(rows, { onConflict: "tenant_id,lodge_id", count: "exact" });
    if (error) {
      errors.push(`Some rate rows couldn't be saved: ${error.message}`);
    } else {
      ratesSaved = count ?? rows.length;
    }
  }

  let newLodgesSubmitted = 0;
  let newLodgesFeaturePending = false;
  if (newLodges.length) {
    const rows = newLodges.map((l) => ({
      tenant_id: tenantId,
      lodge_name: l.lodgeName,
      region: l.region,
      sto_disc: l.stoDisc,
      notes: l.notes,
    }));
    const { error, count } = await supabase.from("lodge_submissions").insert(rows, { count: "exact" });
    if (error) {
      if (error.code === "42P01" || /relation .* does not exist/i.test(error.message || "")) {
        // Migration 005 hasn't been applied yet — don't fail the whole
        // upload over it, the rate edits above already saved fine.
        newLodgesFeaturePending = true;
      } else {
        errors.push(`New lodges couldn't be recorded: ${error.message}`);
      }
    } else {
      newLodgesSubmitted = count ?? rows.length;
    }
  }

  return NextResponse.json({ ratesSaved, newLodgesSubmitted, newLodgesFeaturePending, errors });
}
