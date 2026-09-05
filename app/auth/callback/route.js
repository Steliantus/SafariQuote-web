import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Handles the redirect Supabase sends users to after clicking an invite /
// magic-link / password-reset email.
//
// Two flows land here:
//  - PKCE "code" flow: used when the *browser* itself calls
//    supabase.auth.resetPasswordForEmail()/signInWithOtp() (it generates a
//    code_verifier first, so Supabase can safely hand back a `code`).
//  - "token_hash" flow: used for links generated server-side (Supabase
//    Studio's admin "Send password recovery" button, admin.generateLink,
//    invite emails, etc.) where no code_verifier exists. These verify
//    directly against the emailed token via verifyOtp().
// Our email templates link here with `token_hash` + `type`, so that's the
// path admin-triggered recovery/invite emails use in practice.
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") || "/set-password";

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  } else if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
