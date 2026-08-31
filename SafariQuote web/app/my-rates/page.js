import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { isDemoTenant } from "@/lib/demo";
import MyRatesClient from "./MyRatesClient";

export default async function MyRatesPage() {
  const profile = await requireUser();
  const supabase = await createClient();
  const isDemo = isDemoTenant(profile.tenant_id);

  let tenant = null;
  if (profile.tenant_id) {
    const { data, error } = await supabase
      .from("tenants")
      .select("company_name, sto_discount_pct, is_master_rate_source")
      .eq("id", profile.tenant_id)
      .single();
    tenant = error
      ? (await supabase.from("tenants").select("company_name, sto_discount_pct").eq("id", profile.tenant_id).single()).data
      : data;
  }

  // Best-effort — the review-queue table (migration 005) may not exist yet.
  let mySubmissions = [];
  if (profile.tenant_id) {
    const { data } = await supabase
      .from("lodge_submissions")
      .select("id, lodge_name, region, sto_disc, status, created_at")
      .eq("tenant_id", profile.tenant_id)
      .order("created_at", { ascending: false });
    mySubmissions = data || [];
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 mb-1">My Rates</h1>
      <p className="text-sm text-neutral-500 mb-6 max-w-2xl">
        Download your personal STO-rates spreadsheet, update it with your own negotiated rates, and upload it
        again — SafariQuote can&apos;t see this data, it&apos;s private to your account.
      </p>
      <MyRatesClient
        isDemo={isDemo}
        isMasterRateSource={!!tenant?.is_master_rate_source}
        mySubmissions={mySubmissions}
      />
    </div>
  );
}
