import { createClient } from "@/lib/supabase/server";
import LodgesClient from "./LodgesClient";

export default async function LodgesPage() {
  const supabase = await createClient();
  const { data: lodges } = await supabase
    .from("lodges")
    .select("slug, name, region, sto_disc, currency, updated_at")
    .order("name");

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Lodges & Rates</h1>
      <p className="text-sm text-neutral-500 mb-6">
        {lodges?.length || 0} lodges in the master rate book. Edit a lodge and every tour
        operator's quote builder picks up the change immediately for anything still in draft.
      </p>
      <LodgesClient lodges={lodges || []} />
    </div>
  );
}
