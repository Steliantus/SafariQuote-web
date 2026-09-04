import { createAdminClient } from "@/lib/supabase/admin";
import PendingSignupsClient from "./PendingSignupsClient";

// Admin view of app/signup's leads: everyone who filled in the public
// signup form and was shown our bank-transfer details, but hasn't been
// turned into a real tenant account yet. See app/signup/page.js's header
// comment -- this table is the queue John/Dana work from once they see a
// transfer land.
//
// pending_signups has RLS enabled with zero policies (nothing but the
// service-role key can touch it -- see the webhook/signup routes), so this
// has to read with the admin client rather than the usual cookie-based one.
export default async function PendingSignupsPage() {
  const admin = createAdminClient();
  const { data: signups } = await admin
    .from("pending_signups")
    .select("id, company_name, contact_name, contact_email, phone, plan, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Pending Signups</h1>
      <p className="text-sm text-neutral-500 mb-6">
        People who filled in the public signup form and were shown our bank-transfer
        details. Once you see their payment land, convert them here to create their
        login and send the invite email &mdash; same as the &ldquo;+ Add tour
        operator&rdquo; form, just pre-filled from what they already entered.
      </p>
      <PendingSignupsClient initialSignups={signups || []} />
    </div>
  );
}
