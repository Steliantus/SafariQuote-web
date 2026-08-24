import { createClient } from "@/lib/supabase/server";
import TenantsClient from "./TenantsClient";

export default async function TenantsPage() {
  const supabase = await createClient();
  const { data: tenants } = await supabase
    .from("tenants")
    .select("id, company_name, contact_name, contact_email, sto_discount_pct, status, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Tour Operators</h1>
      <p className="text-sm text-neutral-500 mb-6">
        Each tour operator gets their own login and manages their own travelers and quotes.
        You only control their STO discount and account status here.
      </p>
      <TenantsClient initialTenants={tenants || []} />
    </div>
  );
}
