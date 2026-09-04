import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { resolveSignupPlan } from "@/lib/plans";

// Public "Sign up" entry point, linked from the marketing site (the "Become
// a Member" buttons on the Wix Plans & Pricing page link here as
// /signup?plan=standard or /signup?plan=beta) and from the login page.
// Collects the company/contact details, stores them in pending_signups
// along with the selected plan, then sends the visitor on to
// /signup/payment-details, which shows our bank transfer details so they can
// pay manually. Once John/Dana see the transfer land, they create the real
// tenant by hand via /admin/tenants (see lib/tenantProvisioning.js).
//
// This page never creates a tenant, an auth user, or takes payment itself --
// it only records the visitor's details so the payment-details page can tell
// them how to pay, and so the pending_signups row is there for reference
// when confirming the transfer.
//
// This route is listed in lib/supabase/middleware.js's `isPublic` check so
// unauthenticated visitors can reach it.

async function startSignup(formData) {
  "use server";

  const companyName = (formData.get("companyName") || "").toString().trim();
  const contactName = (formData.get("contactName") || "").toString().trim();
  const contactEmail = (formData.get("contactEmail") || "").toString().trim().toLowerCase();
  const phone = (formData.get("phone") || "").toString().trim();
  const planKey = (formData.get("plan") || "").toString().trim();
  const plan = resolveSignupPlan(planKey);

  if (!companyName || !contactName || !contactEmail || !contactEmail.includes("@")) {
    redirect(`/signup?error=invalid${plan ? `&plan=${plan.key}` : ""}`);
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
    redirect(`/signup?error=exists${plan ? `&plan=${plan.key}` : ""}`);
  }

  const { error: insertError } = await admin.from("pending_signups").insert({
    company_name: companyName,
    contact_name: contactName,
    contact_email: contactEmail,
    phone: phone || null,
    plan: plan ? plan.key : null,
  });
  if (insertError) {
    console.error("Signup lead capture failed:", insertError);
    redirect(`/signup?error=unavailable${plan ? `&plan=${plan.key}` : ""}`);
  }

  redirect(`/signup/payment-details${plan ? `?plan=${plan.key}` : ""}`);
}

export default async function SignupPage({ searchParams }) {
  const params = await searchParams;
  const error = params?.error;
  const plan = resolveSignupPlan(params?.plan);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
        <h1 className="text-xl font-semibold text-neutral-900">SafariQuote</h1>
        <p className="text-sm text-neutral-500 mt-1 mb-6">
          Set up your tour-operator account.
        </p>
        {plan && (
          <p className="text-sm bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 mb-4 text-neutral-700">
            {plan.key === "beta" ? (
              <>
                <span className="font-medium">Congratulations, you are signing up for the Beta Tester Plan!</span>
                {" "}&mdash; {plan.price} {plan.period}.
              </>
            ) : (
              <>
                You&apos;re signing up for the <span className="font-medium">{plan.label}</span> plan
                {" "}&mdash; {plan.price} {plan.period}.
              </>
            )}
          </p>
        )}
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
          <input type="hidden" name="plan" value={plan ? plan.key : ""} />
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
            Continue
          </button>
        </form>
        <p className="text-xs text-neutral-400 mt-6">
          Next we&apos;ll show you our bank details so you can pay by transfer.
          Once we confirm your payment, we&apos;ll email you a link to set
          your password and get started.
        </p>
      </div>
    </div>
  );
}
