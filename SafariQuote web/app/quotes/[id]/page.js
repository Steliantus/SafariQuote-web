import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import QuoteBuilder from "./QuoteBuilder";

export default async function QuotePage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: quote }, { data: lodgeList }, { data: travelers }, { data: profile }] = await Promise.all([
    supabase.from("quotes").select("*").eq("id", id).single(),
    supabase.from("lodges").select("id, name, region").order("name"),
    supabase.from("travelers").select("id, name").order("name"),
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return null;
      const { data: p } = await supabase.from("profiles").select("tenant_id").eq("id", data.user.id).single();
      if (!p?.tenant_id) return null;
      const { data: t } = await supabase.from("tenants").select("sto_discount_pct").eq("id", p.tenant_id).single();
      return t;
    }),
  ]);

  if (!quote) notFound();

  return (
    <QuoteBuilder
      quote={quote}
      lodgeList={lodgeList || []}
      travelers={travelers || []}
      tenantStoDiscount={profile?.sto_discount_pct ?? 10}
    />
  );
}
