import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { DEMO_EMAIL, DEMO_TENANT_ID } from "@/lib/demo";

// Public "Try SafariQuote free" entry point, linked from the marketing site
// homepage. Collects the visitor's name / company / email for marketing
// follow-up, then signs them straight into the one fixed demo tenant login
// and drops them into a live, empty quote in the real Quote Builder --
// pre-loaded with the frozen demo lodge dataset -- so the trial actually
// demonstrates the product instead of showing an empty stats dashboard.
//
// Security notes (read before touching this file):
//   - startTrial() below ALWAYS authenticates as the single fixed
//     DEMO_EMAIL. It never uses the visitor-supplied email to sign in --
//     that email is stored only as a marketing lead. That is the whole
//     safety property that makes an unauthenticated auto-login route
//     acceptable at all. Do not add a way to parameterize which account
//     this logs into.
//   - createAdminClient() uses the service-role key and fully bypasses RLS.
//     It's used here ONLY to (a) record the lead in trial_leads and
//     (b) mint a one-time magic-link token for the fixed demo email --
//     never to read/write arbitrary data on the visitor's behalf.
//   - This route is listed in lib/supabase/middleware.js's `isPublic` check
//     so unauthenticated visitors can reach it; nothing else needs to be
//     added there for this feature to work (the form's POST lands on this
//     same /trial pathname).

async function startTrial(formData) {
"use server";

const name = (formData.get("name") || "").toString().trim();
const company = (formData.get("company") || "").toString().trim();
const email = (formData.get("email") || "").toString().trim();

if (!name || !company || !email || !email.includes("@")) {
redirect("/trial?error=invalid");
}

let failed = false;
  let destination = "/dashboard?demo=1";
  try {
const admin = createAdminClient();

const { error: leadError } = await admin
.from("trial_leads")
.insert({ name, company, email });
if (leadError) throw leadError;

const { data, error: linkError } = await admin.auth.admin.generateLink({
type: "magiclink",
email: DEMO_EMAIL,
});
if (linkError || !data?.properties?.hashed_token) {
throw linkError || new Error("generateLink returned no hashed_token");
}

const supabase = await createClient();
const { error: verifyError } = await supabase.auth.verifyOtp({
token_hash: data.properties.hashed_token,
type: "magiclink",
});
if (verifyError) throw verifyError;

        // Drop the visitor straight into a real, working quote instead of the
        // empty stats dashboard -- this is the actual "trial" experience: the
        // Quote Builder opens pre-loaded with the frozen demo lodge dataset so
        // they can immediately pick a lodge and build an itinerary. Treated as
        // non-critical: if creating the quote fails for any reason, they still
        // land signed-in on the dashboard rather than seeing an error.
        const { data: quote, error: quoteError } = await admin
          .from("quotes")
          .insert({ tenant_id: DEMO_TENANT_ID, client_name: "New quote" })
          .select("id")
          .single();
        if (!quoteError && quote?.id) {
                destination = `/quotes/${quote.id}`;
        }
} catch (e) {
console.error("Trial signup failed:", e);
failed = true;
}

  redirect(failed ? "/trial?error=unavailable" : destination);
}

export default async function TrialPage({ searchParams }) {
const params = await searchParams;
const error = params?.error;

return (
<div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
<div className="w-full max-w-sm bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
<h1 className="text-xl font-semibold text-neutral-900">SafariQuote</h1>
<p className="text-sm text-neutral-500 mt-1 mb-6">
Start your free test flight — no password needed.
</p>
{error && (
<p className="text-sm text-red-600 mb-4">
{error === "invalid"
? "Please fill in your name, company, and a valid email."
: "Something went wrong starting your trial. Please try again."}
</p>
)}
<form action={startTrial} className="space-y-4">
<div>
<label className="block text-sm font-medium text-neutral-700 mb-1">
Your name
</label>
<input
type="text"
name="name"
required
className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-800"
/>
</div>
<div>
<label className="block text-sm font-medium text-neutral-700 mb-1">
Company name
</label>
<input
type="text"
name="company"
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
name="email"
required
className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-800"
/>
</div>
<button
type="submit"
className="w-full bg-neutral-900 text-white rounded-lg py-2 text-sm font-medium"
>
Start my test flight
</button>
</form>
<p className="text-xs text-neutral-400 mt-6">
We&apos;ll use this to follow up about SafariQuote. Your trial runs
on sample data only and resets nightly.
</p>
</div>
</div>
);
}
