import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createTenantAndInvite } from "@/lib/tenantProvisioning";

// POST /api/signup/webhook — a paid signup on the Wix "Safariquote" site
// (Pay Link + Automation) lands here to provision the tour operator's
// account automatically, using the exact same tenant-creation + invite-email
// logic as Dana's "+ Add tour operator" admin form (see
// lib/tenantProvisioning.js).
//
// Guarded by a shared secret (SIGNUP_WEBHOOK_TOKEN, set in Netlify env vars)
// the same way app/api/admin/reset-demo/route.js is -- set this same value
// as a header on the Wix Automation's outgoing webhook call.
//
// NOTE: the exact field names Wix's Automation sends aren't finalized yet
// (pending the Wix-side Pay Link/Automation setup) -- this accepts a few
// likely spellings per field so it isn't brittle to that choice, but double
// check against the real payload once the Automation is wired up and adjust
// FIELD_ALIASES below if needed.
const FIELD_ALIASES = {
  companyName: ["companyName", "company_name", "company", "businessName", "business_name"],
  contactName: ["contactName", "contact_name", "name", "fullName", "full_name", "buyerName"],
  contactEmail: ["contactEmail", "contact_email", "email", "buyerEmail", "payerEmail"],
  phone: ["phone", "phoneNumber", "phone_number"],
};

function pick(body, field) {
  for (const key of FIELD_ALIASES[field]) {
    if (body[key] != null && body[key] !== "") return body[key];
  }
  return null;
}

export async function POST(request) {
  const expected = process.env.SIGNUP_WEBHOOK_TOKEN;
  if (!expected) {
    return NextResponse.json({ error: "SIGNUP_WEBHOOK_TOKEN is not configured" }, { status: 500 });
  }
  const provided = request.headers.get("x-signup-token");
  if (provided !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const companyName = pick(body, "companyName");
  const contactName = pick(body, "contactName");
  const contactEmail = pick(body, "contactEmail");
  const phone = pick(body, "phone");

  if (!contactEmail) {
    return NextResponse.json({ error: "No contact email in payload", received: body }, { status: 400 });
  }

  const admin = createAdminClient();

  // Idempotency: a Wix Automation can retry a webhook delivery. If a tenant
  // already exists for this email, don't create a second one -- just report
  // it back as already-provisioned.
  const { data: existing } = await admin.from("tenants").select("id, company_name").eq("contact_email", contactEmail).maybeSingle();
  if (existing) {
    return NextResponse.json({ tenant: existing, alreadyExisted: true });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;

  let tenant, inviteError;
  try {
    ({ tenant, inviteError } = await createTenantAndInvite(
      { companyName: companyName || contactEmail, contactName, contactEmail, phone },
      { siteUrl }
    ));
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.status || 500 });
  }

  if (inviteError) {
    return NextResponse.json(
      { tenant, warning: `Tenant created, but invite email failed: ${inviteError.message}` },
      { status: 207 }
    );
  }

  return NextResponse.json({ tenant });
}
