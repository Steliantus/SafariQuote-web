import { createClient } from "@/lib/supabase/server";
import QuotesClient from "./QuotesClient";

export default async function QuotesPage() {
  const supabase = await createClient();
  const { data: quotes } = await supabase
    .from("quotes")
    .select("id, client_name, status, updated_at")
    .order("updated_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Quotes</h1>
      <p className="text-sm text-neutral-500 mb-6">
        Drafts always price against today's live lodge rates. Confirming a quote locks its price.
      </p>
      <QuotesClient initialQuotes={quotes || []} />
    </div>
  );
}
