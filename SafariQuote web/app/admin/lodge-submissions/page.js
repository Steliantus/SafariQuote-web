import { createClient } from "@/lib/supabase/server";
import LodgeSubmissionsClient from "./LodgeSubmissionsClient";

export default async function LodgeSubmissionsPage() {
  const supabase = await createClient();
  const { data: submissions, error } = await supabase
    .from("lodge_submissions")
    .select("id, lodge_name, region, sto_disc, notes, status, admin_notes, created_at, tenant_id, tenants(company_name)")
    .order("created_at", { ascending: false });

  // migration 005 not applied yet — show a plain heads-up instead of a
  // broken page (see supabase/migrations/005_lodge_submissions.sql).
  const tableMissing = !!error && (error.code === "42P01" || /relation .* does not exist/i.test(error.message || ""));

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Lodge Submissions</h1>
      <p className="text-sm text-neutral-500 mb-6">
        Lodges tour operators have flagged from their My Rates spreadsheet that aren&apos;t in SafariQuote yet.
        Approving here doesn&apos;t add the lodge automatically — it just marks that you&apos;ve actioned it
        (added rooms/seasons/rates for real) or decided not to.
      </p>
      {tableMissing ? (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl p-4">
          This feature&apos;s database table hasn&apos;t been created yet (migration 005_lodge_submissions.sql).
        </div>
      ) : (
        <LodgeSubmissionsClient initialSubmissions={submissions || []} />
      )}
    </div>
  );
}
