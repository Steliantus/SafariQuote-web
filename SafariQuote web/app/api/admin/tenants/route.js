import { NextResponse } from "next/server";
import { getProfile } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// POST /api/admin/tenants — Dana creates a new tour-operator account and
// sends them an email invite. Admin-only (checked server-side below; the
// service-role client used here bypasses RLS, so this check is the only
// thing standing between this route and full database access).
export async function POST(request) {
  const profile = await getProfile();
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { companyName, contactName, contactEmail, phone, stoDiscountPct } = body;
  if (!companyName || !contactEmail) {
    return NextResponse.json({ error: "companyName and contactEmail are required" }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: tenant, error: tenantError } = await admin
    .from("tenants")
    .insert({
      company_name: companyName,
      contact_name: contactName || null,
      contact_email: contactEmail,
      phone: phone || null,
      sto_discount_pct: typeof stoDiscountPct === "number" ? stoDiscountPct : 10,
    })
    .select()
    .single();

  if (tenantError) {
    return NextResponse.json({ error: tenantError.message }, { status: 500 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const { error: inviteError } = await admin.auth.admin.inviteUserByEmail(contactEmail, {
    data: { role: "tenant", tenant_id: tenant.id, full_name: contactName || null },
    redirectTo: `${siteUrl}/auth/callback?next=/set-password`,
  });

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
