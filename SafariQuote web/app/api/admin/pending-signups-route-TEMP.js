import { NextResponse } from "next/server";
import { getProfile } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createTenantAndInvite } from "@/lib/tenantProvisioning";

// POST /api/admin/pending-signups — converts one pending_signups row (a
// visitor who filled in the public /signup form and was shown our
// bank-transfer details) into a real tenant account, once John/Dana have
// confirmed the transfer landed. Reuses the exact same tenant-creation +
// invite-email logic as the "+ Add tour operator" form and the signup
// webhook -- see lib/tenantProvisioning.js. Admin-only.
export async function POST(request) {
  const profile = await getProfile();
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { id, companyName, contactName, contactEmail, phone } = body;
  if (!id || !contactEmail) {
    return NextResponse.json({ error: "id and contactEmail are required" }, { status: 400 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;

  let tenant, inviteError;
  try {
    ({ tenant, inviteError } = await createTenantAndInvite(
      { companyName, contactName, contactEmail, phone },
      { siteUrl }
    ));
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.status || 500 });
  }

  // Best-effort cleanup, same as the webhook route -- a failure here
  // shouldn't hide the fact that the tenant itself was created fine.
  const admin = createAdminClient();
  await admin.from("pending_signups").delete().eq("id", id);

  if (inviteError) {
    return NextResponse.json(
      { tenant, warning: `Tenant created, but invite email failed: ${inviteError.message}` },
      { status: 207 }
    );
  }

  return NextResponse.json({ tenant });
}
