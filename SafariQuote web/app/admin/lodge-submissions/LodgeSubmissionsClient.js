"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const STATUS_STYLE = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default function LodgeSubmissionsClient({ initialSubmissions }) {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [filter, setFilter] = useState("pending");

  async function setStatus(id, status) {
    const supabase = createClient();
    setSubmissions((rows) => rows.map((r) => (r.id === id ? { ...r, status } : r)));
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await supabase
      .from("lodge_submissions")
      .update({ status, reviewed_by: user?.id || null, reviewed_at: new Date().toISOString() })
      .eq("id", id);
  }

  const visible = filter === "all" ? submissions : submissions.filter((s) => s.status === filter);

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {["pending", "approved", "rejected", "all"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-full border ${
              filter === f ? "bg-neutral-900 text-white border-neutral-900" : "border-neutral-300 text-neutral-600"
            }`}
          >
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl divide-y divide-neutral-100">
        {visible.length === 0 && <div className="px-4 py-8 text-center text-neutral-400 text-sm">Nothing here.</div>}
        {visible.map((s) => (
          <div key={s.id} className="px-4 py-3 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-neutral-900">{s.lodge_name}</span>
                {s.region && <span className="text-xs text-neutral-400">{s.region}</span>}
                <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLE[s.status] || ""}`}>{s.status}</span>
              </div>
              <div className="text-xs text-neutral-500 mt-0.5">
                {s.tenants?.company_name || "Unknown operator"}
                {s.sto_disc != null && <> · says they negotiate {s.sto_disc}%</>}
                {s.notes && <> · &quot;{s.notes}&quot;</>}
              </div>
            </div>
            {s.status === "pending" && (
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => setStatus(s.id, "approved")}
                  className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-200"
                >
                  Mark handled
                </button>
                <button
                  onClick={() => setStatus(s.id, "rejected")}
                  className="text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-200"
                >
                  Dismiss
                </button>
              </div>
            )}
            {s.status !== "pending" && (
              <button onClick={() => setStatus(s.id, "pending")} className="text-xs text-neutral-400 hover:underline shrink-0">
                Reopen
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
