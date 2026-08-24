import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/SignOutButton";

export default async function TenantLayout({ children }) {
  const profile = await requireUser();
  const supabase = await createClient();
  const { data: tenant } = profile.tenant_id
    ? await supabase.from("tenants").select("company_name").eq("id", profile.tenant_id).single()
    : { data: null };

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-neutral-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="font-semibold">SafariQuote{tenant ? ` · ${tenant.company_name}` : ""}</span>
            <nav className="flex gap-5 text-sm text-neutral-300">
              <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
              <Link href="/quotes" className="hover:text-white">Quotes</Link>
              <Link href="/travelers" className="hover:text-white">Travelers</Link>
              <Link href="/my-rates" className="hover:text-white">My Rates</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm text-neutral-300">
            <span>{profile.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
