import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import MyRatesClient from "./MyRatesClient";

export default async function MyRatesPage() {
  const profile = await requireUser();
  const supabase = await createClient();

  const [{ data: lodges }, { data: myRates }] = await Promise.all([
    supabase.from("lodges").select("id, name, region, sto_disc").order("name"),
    profile.tenant_id
      ? supabase
          .from("tenant_lodge_rates")
          .select("lodge_id, sto_disc, updated_at")
          .eq("tenant_id", profile.tenant_id)
      : Promise.resolve({ data: [] }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 mb-1">My Rates</h1>
      <p className="text-sm text-neutral-500 mb-6">
        Your own negotiated STO discount per lodge — private to your account. Ondjamba Safaris cannot read
        these values, the same way they can&apos;t read your travelers or quotes. Set a rate here and your
        quote builder will use it automatically instead of the lodge&apos;s default.
      </p>
      <MyRatesClient
        lodges={lodges || []}
        initialRates={myRates || []}
        tenantId={profile.tenant_id}
      />
    </div>
  );
}
