"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function QuotesClient({ initialQuotes }) {
  const router = useRouter();
  const [quotes] = useState(initialQuotes);
  const [creating, setCreating] = useState(false);

  async function handleCreate() {
    setCreating(true);
    const supabase = createClient();
    const { data: profile } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("quotes")
      .insert({ client_name: "New quote", created_by: profile.user.id })
      .select()
      .single();
    setCreating(false);
    if (!error) router.push(`/quotes/${data.id}`);
  }

  return (
    <div>
      <button onClick={handleCreate} disabled={creating} className="mb-4 bg-neutral-900 text-white text-sm px-4 py-2 rounded-lg disabled:opacity-50">
        {creating ? "Creating..." : "+ New quote"}
      </button>
      <div className="bg-white border border-neutral-200 rounded-xl divide-y divide-neutral-100">
        {quotes.map((q) => (
          <Link key={q.id} href={`/quotes/${q.id}`} className="flex items-center justify-between px-4 py-3 hover:bg-neutral-50">
            <span className="text-sm font-medium text-neutral-900">{q.client_name}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${q.status === "confirmed" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
              {q.status}
            </span>
          </Link>
        ))}
        {quotes.length === 0 && <div className="px-4 py-8 text-center text-neutral-400 text-sm">No quotes yet.</div>}
      </div>
    </div>
  );
}
