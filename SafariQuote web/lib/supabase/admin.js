import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// SERVER-ONLY client using the service role key. This bypasses Row Level
// Security entirely -- only ever import this file from Route Handlers /
// Server Actions that have already verified the caller is an admin
// (see requireAdmin() below). Never import this into a Client Component.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Add it to .env.local (server-only, never NEXT_PUBLIC_)."
    );
  }
  return createSupabaseClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
