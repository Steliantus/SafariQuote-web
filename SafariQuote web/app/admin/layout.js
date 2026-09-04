import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import SignOutButton from "@/components/SignOutButton";

export default async function AdminLayout({ children }) {
  const profile = await requireAdmin();

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-neutral-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="font-semibold">SafariQuote · Admin</span>
            <nav className="flex gap-5 text-sm text-neutral-300">
              <Link href="/admin" className="hover:text-white">Dashboard</Link>
              <Link href="/admin/tenants" className="hover:text-white">Tour Operators</Link>
              <Link href="/admin/pending-signups" className="hover:text-white">Pending Signups</Link>
              <Link href="/admin/lodges" className="hover:text-white">Lodges & Rates</Link>
              <Link href="/admin/lodge-submissions" className="hover:text-white">Lodge Submissions</Link>
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
