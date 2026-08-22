import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const [{ count: lodgeCount }, { count: tenantCount }, { count: draftCount }, { count: confirmedCount }] =
    await Promise.all([
      supabase.from("lodges").select("*", { count: "exact", head: true }),
      supabase.from("tenants").select("*", { count: "exact", head: true }),
      supabase.from("quotes").select("*", { count: "exact", head: true }).eq("status", "draft"),
      supabase.from("quotes").select("*", { count: "exact", head: true }).eq("status", "confirmed"),
    ]);

  const stats = [
    { label: "Lodges in master rate book", value: lodgeCount ?? "—", href: "/admin/lodges" },
    { label: "Tour operator accounts", value: tenantCount ?? "—", href: "/admin/tenants" },
    { label: "Draft quotes (live pricing)", value: draftCount ?? "—" },
    { label: "Confirmed quotes (locked)", value: confirmedCount ?? "—" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Dashboard</h1>
      <p className="text-sm text-neutral-500 mb-8">
        Update lodge rates here and every tour operator's quote builder reflects it instantly.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Card = (
            <div className="bg-white border border-neutral-200 rounded-xl p-5">
              <div className="text-2xl font-semibold text-neutral-900">{s.value}</div>
              <div className="text-sm text-neutral-500 mt-1">{s.label}</div>
            </div>
          );
          return s.href ? (
            <Link key={s.label} href={s.href} className="block hover:opacity-80">
              {Card}
            </Link>
          ) : (
            <div key={s.label}>{Card}</div>
          );
        })}
      </div>
    </div>
  );
}
