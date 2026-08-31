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
                // is_master_rate_source is only true for Ondjamba's own tenant row --
                // see supabase/migrations/004_master_rate_source.sql. If that column
                // hasn't been added to this database yet, this select errors and we
                // fall back to the pre-migration query, leaving the flag `null`
                // (unknown) rather than guessing `false` -- QuoteBuilder only applies
                // its new rate-capping logic once it positively knows a tenant is NOT
                // the master rate source, so an unmigrated database just behaves
                // exactly as it did before this flag existed.
                const { data: t, error: tErr } = await supabase
                  .from("tenants")
                  .select("sto_discount_pct, is_master_rate_source")
                  .eq("id", p.tenant_id)
                  .single();
                if (tErr) {
                  const { data: tFallback } = await supabase.from("tenants").select("sto_discount_pct").eq("id", p.tenant_id).single();
                  return { tenantId: p.tenant_id, sto_discount_pct: tFallback?.sto_discount_pct, is_master_rate_source: null };
                }
                return { tenantId: p.tenant_id, sto_discount_pct: t?.sto_discount_pct, is_master_rate_source: t?.is_master_rate_source ?? null };
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
      isMasterRateSource={profile?.is_master_rate_source ?? null}
    />
          );
}
