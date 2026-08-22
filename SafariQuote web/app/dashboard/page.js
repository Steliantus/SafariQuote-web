import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function TenantDashboard() {
  const supabase = await createClient();
  const [{ count: travelerCount }, { count: draftCount }, { count: confirmedCount }, { data: recentQuotes }] =
    await Promise.all([
      supabase.from("travelers").select("*", { count: "exact", head: true }),
      supabase.from("quotes").select("*", { count: "exact", head: true }).eq("status", "draft"),
      supabase.from("quotes").select("*", { count: "exact", head: true }).eq("status", "confirmed"),
      supabase.from("quotes").select("id, client_name, status, updated_at").order("updated_at", { ascending: false }).limit(5),
    ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-neutral-200 rounded-xl p-5">
          <div className="text-2xl font-semibold text-neutral-900">{travelerCount ?? "—"}</div>
          <div className="text-sm text-neutral-500 mt-1">Travelers</div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl p-5">
          <div className="text-2xl font-semibold text-neutral-900">{draftCount ?? "—"}</div>
          <div className="text-sm text-neutral-500 mt-1">Draft quotes</div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl p-5">
          <div className="text-2xl font-semibold text-neutral-900">{confirmedCount ?? "—"}</div>
          <div className="text-sm text-neutral-500 mt-1">Confirmed programs</div>
        </div>
      </div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide">Recent quotes</h2>
        <Link href="/quotes" className="text-sm text-neutral-500 hover:underline">View all →</Link>
      </div>
      <div className="bg-white border border-neutral-200 rounded-xl divide-y divide-neutral-100">
        {(recentQuotes || []).map((q) => (
          <Link key={q.id} href={`/quotes/${q.id}`} className="flex items-center justify-between px-4 py-3 hover:bg-neutral-50">
            <span className="text-sm font-medium text-neutral-900">{q.client_name}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${q.status === "confirmed" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
              {q.status}
            </span>
          </Link>
        ))}
        {(!recentQuotes || recentQuotes.length === 0) && (
          <div className="px-4 py-8 text-center text-neutral-400 text-sm">No quotes yet.</div>
        )}
      </div>
    </div>
  );
}
