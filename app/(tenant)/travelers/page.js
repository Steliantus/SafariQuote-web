import { createClient } from "@/lib/supabase/server";
import TravelersClient from "./TravelersClient";

export default async function TravelersPage() {
  const supabase = await createClient();
  const { data: travelers } = await supabase
    .from("travelers")
    .select("id, name, email, phone, notes, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Travelers</h1>
      <p className="text-sm text-neutral-500 mb-6">
        Your own client records — private to your account. Ondjamba Safaris cannot edit these.
      </p>
      <TravelersClient initialTravelers={travelers || []} />
    </div>
  );
}
