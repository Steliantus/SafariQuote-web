import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { DEMO_EMAIL } from "@/lib/demo";

// Public "Try SafariQuote free" entry point, linked from the marketing site
// homepage. No signup, no form, no password: this route signs the visitor
// straight into the one fixed demo tenant login and drops them into the
// real dashboard, exactly as any tour operator would see it.
//
// Security notes (read before touching this file):
//   - This ALWAYS authenticates as the single fixed DEMO_EMAIL. It never
//     accepts an email/identity from the request (query string, body,
//     headers, cookies) -- that is the whole safety property that makes an
//     unauthenticated auto-login route acceptable at all. Do not add a way
//     to parameterize which account this logs into.
//   - createAdminClient() uses the service-role key and fully bypasses RLS.
//     It is used here ONLY to mint a one-time magic-link token for the
//     fixed demo email, never to read/write arbitrary data on the visitor's
//     behalf.
//   - This route is listed in lib/supabase/middleware.js's `isPublic` check
//     so unauthenticated visitors can reach it; nothing else needs to be
//     added there for this feature to work.
export async function GET(request) {
    // Use the public site origin, not request.url's origin -- on Netlify the
  // request seen by this route can carry the deploy-specific internal
  // hostname (e.g. <deploy-id>--safariquote-app.netlify.app) rather than
  // the custom domain the visitor actually used. Redirecting to that origin
  // strands the just-set auth cookie (scoped to the public domain) on a
  // different host, so the very next request looks logged-out. See the
  // same pattern in app/api/admin/tenants/route.js.
  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;

  try {
        const admin = createAdminClient();
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

      return NextResponse.redirect(`${origin}/dashboard?demo=1`);
  } catch (e) {
        console.error("Trial auto-login failed:", e);
        return NextResponse.redirect(`${origin}/login?error=trial_unavailable`);
  }
}
