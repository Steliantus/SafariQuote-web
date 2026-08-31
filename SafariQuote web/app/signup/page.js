import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

// Public "Sign up" entry point, linked from the marketing site and from the
// login page. Collects the company/contact details a Wix Pay Link can't
// reliably capture on its own, stores them in pending_signups, then sends
// the visitor on to Wix to actually pay. Once that payment completes, a Wix
// Automation calls app/api/signup/webhook/route.js, which creates the real
// tenant row (looking up this pending row by email to fill in whatever Wix
// itself didn't send) and emails an invite to set a password.
//
// This page never creates a tenant, an auth user, or takes payment itself --
// it only records the visitor's details so the webhook can complete the job
// once Wix confirms payment. See lib/tenantProvisioning.js for what happens
// after that.
//
// This route is listed in lib/supabase/middleware.js's `isPublic` check so
// unauthenticated visitors can reach it.

async function startSignup(formData) {
  "use server";

  const companyName = (formData.get("companyName") || "").toString().trim();
  const contactName = (formData.get("contactName") || "").toString().trim();
  const contactEmail = (formData.get("contactEmail") || "").toString().trim().toLowerCase();
  const phone = (formData.get("phone") || "").toString().trim();

  if (!companyName || !contactName || !contactEmail || !contactEmail.includes("@")) {
    redirect("/signup?error=invalid");
  }

  const payLinkUrl = process.env.NEXT_PUBLIC_WIX_PAY_LINK_URL;
  if (!payLinkUrl) {
    redirect("/signup?error=unavailable");
  }

  const admin = createAdminClient();

  // Someone who already has an account shouldn't be sent through checkout
  // again -- point them at login instead.
  const { data: existingTenant } = await admin
    .from("tenants")
    .select("id")
    .eq("contact_email", contactEmail)
    .maybeSingle();
  if (existingTenant) {
    redirect("/signup?error=exists");
  }

  const { error: insertError } = await admin.from("pending_signups").insert({
    company_name: companyName,
    contact_name: contactName,
    contact_email: contactEmail,
    phone: phone || null,
  });
  if (insertError) {
    console.error("Signup lead capture failed:", insertError);
    redirect("/signup?error=unavailable");
  }

  redirect(payLinkUrl);
}

export default async function SignupPage({ searchParams }) {
  const params = await searchParams;
  const error = params?.error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
        <h1 className="text-xl font-semibold text-neutral-900">SafariQuote</h1>
        <p className="text-sm text-neutral-500 mt-1 mb-6">
          Set up your tour-operator account.
        </p>
        {error && (
          <p className="text-sm text-red-600 mb-4">
            {error === "invalid"
              ? "Please fill in your company name, your name, and a valid email."
              : error === "exists"
              ? "That email already has a SafariQuote account -- try signing in instead."
              : "Signup isn't available right now. Please try again shortly."}
          </p>
        )}
        <form action={startSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Company name
            </label>
            <input
              type="text"
              name="companyName"
              required
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Your name
            </label>
            <input
              type="text"
              name="contactName"
              required
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              name="contactEmail"
              required
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Phone (optional)
            </label>
            <input
              type="tel"
              name="phone"
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-800"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-neutral-900 text-white rounded-lg py-2 text-sm font-medium"
          >
            Continue to payment
          </button>
        </form>
        <p className="text-xs text-neutral-400 mt-6">
          You&apos;ll be taken to our payment provider to complete your
          subscription. Once payment is confirmed we&apos;ll email you a link
          to set your password and get started.
        </p>
      </div>
    </div>
  );
}
