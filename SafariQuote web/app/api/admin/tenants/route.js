import { NextResponse } from "next/server";
import { getProfile } from "@/lib/supabase/server";
import { createTenantAndInvite } from "@/lib/tenantProvisioning";

// POST /api/admin/tenants — Dana creates a new tour-operator account and
// sends them an email invite. Admin-only (checked server-side below; the
// service-role client used inside createTenantAndInvite bypasses RLS, so
// this check is the only thing standing between this route and full
// database access).
//
// The actual create-tenant-and-invite logic lives in
// lib/tenantProvisioning.js, shared with app/api/signup/webhook/route.js —
// a paid signup completing on the Wix side provisions an account the exact
// same way this form does.
export async function POST(request) {
    const profile = await getProfile();
    if (!profile || profile.role !== "admin") {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

const body = await request.json();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;

let tenant, inviteError;
  try {
    ({ tenant, inviteError } = await createTenantAndInvite(body, { siteUrl }));
                                   } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.status || 500 });
  }

if (inviteError) {
  // Tenant row was created but the invite failed (e.g. user already
  // exists) -- surface this clearly so Dana can retry the invite rather
  // than assume nothing happened.
  return NextResponse.json(
    { tenant, warning: `Tenant created, but invite email failed: ${inviteError.message}` },
    { status: 207 }
    );
}

return NextResponse.json({ tenant });
}
