import { createAdminClient } from "@/lib/supabase/admin";

// Shared by app/api/admin/tenants/route.js (Dana adding a tour operator by
// hand) and app/api/signup/webhook/route.js (a paid signup completing on the
// Wix side and provisioning the account automatically). Both paths need the
// exact same two steps: create the tenants row, then invite the contact by
// email so they can set a password and land in the app.
//
// Returns { tenant, inviteError } — inviteError is non-null when the tenant
// row was created fine but the invite email itself failed to send (e.g. the
// address already has an account); callers decide how to surface that.
// Throws only if the tenant row itself couldn't be created.
export async function createTenantAndInvite(
  { companyName, contactName, contactEmail, phone, stoDiscountPct },
  { siteUrl }
  ) {
  if (!companyName || !contactEmail) {
    throw Object.assign(new Error("companyName and contactEmail are required"), { status: 400 });
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
  throw Object.assign(new Error(tenantError.message), { status: 500 });
}

const { error: inviteError } = await admin.auth.admin.inviteUserByEmail(contactEmail, {
  data: { role: "tenant", tenant_id: tenant.id, full_name: contactName || null },
  redirectTo: `${siteUrl}/auth/callback?next=/set-password`,
});

return { tenant, inviteError: inviteError || null };
}
