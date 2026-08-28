import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { isDemoTenant, getDemoLodgeList } from "@/lib/demo";
import QuoteBuilder from "./QuoteBuilder";

export default async function QuotePage({ params }) {
    const { id } = await params;
    const supabase = await createClient();

  const [{ data: quote }, { data: travelers }, { data: profile }] = await Promise.all([
        supabase.from("quotes").select("*").eq("id", id).single(),
        supabase.from("travelers").select("id, name").order("name"),
        supabase.auth.getUser().then(async ({ data }) => {
                if (!data.user) return null;
                const { data: p } = await supabase.from("profiles").select("tenant_id").eq("id", data.user.id).single();
                if (!p?.tenant_id) return null;
                const { data: t } = await supabase.from("tenants").select("sto_discount_pct").eq("id", p.tenant_id).single();
                return { tenantId: p.tenant_id, sto_discount_pct: t?.sto_discount_pct };
        }),
      ]);

  if (!quote) notFound();

  const isDemo = isDemoTenant(profile?.tenantId);
    // The trial's lodge picker is served from the frozen 2026-rates/10%-STO
  // demo dataset (lib/demo.js), never from the live `lodges` table -- see
  // app/trial/route.js for why.
  const liveLodgeList = isDemo
      ? null
        : (await supabase.from("lodges").select("id, name, region").order("name")).data;
    const lodgeList = isDemo ? getDemoLodgeList() : liveLodgeList || [];

  return (
        <QuoteBuilder
        quote={quote}
        lodgeList={lodgeList}
        travelers={travelers || []}
      tenantStoDiscount={profile?.sto_discount_pct ?? 10}
      tenantId={profile?.tenantId || null}
      isDemo={isDemo}
    />
          );
}
