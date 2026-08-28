import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { DEMO_TENANT_ID } from "@/lib/demo";

// Nightly reset for the public trial (see app/trial/route.js): wipes every
// quote and traveler the demo tenant has accumulated, so one visitor's play
// session never carries over into the next person's trial. Called by a
// scheduled task hitting this URL once a day -- see DEPLOY_TRIAL.md for how
// that's set up. Not linked from anywhere in the UI.
//
// Guarded by a shared secret (DEMO_RESET_TOKEN, set in Netlify env vars) so
// this can't be used to wipe demo data by anyone who merely finds the URL.
// It ONLY ever touches rows with tenant_id = DEMO_TENANT_ID -- it has no
// path to any real tenant's data.
export async function POST(request) {
    const expected = process.env.DEMO_RESET_TOKEN;
    if (!expected) {
          return NextResponse.json({ error: "DEMO_RESET_TOKEN is not configured" }, { status: 500 });
    }
    const provided = request.headers.get("x-reset-token");
    if (provided !== expected) {
          return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

  const admin = createAdminClient();
    const [{ error: quotesError }, { error: travelersError }] = await Promise.all([
          admin.from("quotes").delete().eq("tenant_id", DEMO_TENANT_ID),
          admin.from("travelers").delete().eq("tenant_id", DEMO_TENANT_ID),
        ]);

  if (quotesError || travelersError) {
        return NextResponse.json(
          { error: "reset failed", quotesError, travelersError },
          { status: 500 }
              );
  }

  return NextResponse.json({ ok: true, reset_at: new Date().toISOString() });
}
