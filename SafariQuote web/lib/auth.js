import { redirect } from "next/navigation";
import { getProfile } from "@/lib/supabase/server";

// Server-side guard: call at the top of an admin page/route. Redirects
// non-admins away. Returns the caller's profile on success.
export async function requireAdmin() {
  const profile = await getProfile();
  if (!profile || profile.role !== "admin") {
    redirect("/dashboard");
  }
  return profile;
}

// Server-side guard for any logged-in user (admin or tenant).
export async function requireUser() {
  const profile = await getProfile();
  if (!profile) {
    redirect("/login");
  }
  return profile;
}
