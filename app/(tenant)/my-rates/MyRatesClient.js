"use client";

import { useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";

export default function MyRatesClient({ lodges, initialRates, tenantId }) {
  const [q, setQ] = useState("");
  const [ratesByLodge, setRatesByLodge] = useState(() => {
    const map = {};
    for (const r of initialRates) map[r.lodge_id] = r.sto_disc;
    return map;
  });
  const [draft, setDraft] = useState({}); // lodge_id -> string being typed
  const [savingId, setSavingId] = useState(null);
  const [message, setMessage] = useState("");

  const filtered = useMemo(() => {
    if (!q.trim()) return lodges;
    const needle = q.toLowerCase();
    return lodges.filter(
      (l) => l.name.toLowerCase().includes(needle) || (l.region || "").toLowerCase().includes(needle)
    );
  }, [q, lodges]);

  function valueFor(lodgeId) {
    if (draft[lodgeId] !== undefined) return draft[lodgeId];
    return ratesByLodge[lodgeId] != null ? String(ratesByLodge[lodgeId]) : "";
  }

  async function handleSave(lodgeId) {
    if (!tenantId) return;
    const raw = draft[lodgeId];
    const num = Number(raw);
    if (raw === undefined || raw === "" || Number.isNaN(num)) return;

    setSavingId(lodgeId);
    setMessage("");
    const supabase = createClient();
    const { error } = await supabase
      .from("tenant_lodge_rates")
      .upsert({ tenant_id: tenantId, lodge_id: lodgeId, sto_disc: num }, { onConflict: "tenant_id,lodge_id" });
    setSavingId(null);

    if (error) {
      setMessage(`Error: ${error.message}`);
      return;
    }
    setRatesByLodge((r) => ({ ...r, [lodgeId]: num }));
    setDraft((d) => {
      const next = { ...d };
      delete next[lodgeId];
      return next;
    });
  }

  async function handleClear(lodgeId) {
    if (!tenantId) return;
    setSavingId(lodgeId);
    const supabase = createClient();
    await supabase.from("tenant_lodge_rates").delete().eq("tenant_id", tenantId).eq("lodge_id", lodgeId);
    setSavingId(null);
    setRatesByLodge((r) => {
      const next = { ...r };
      delete next[lodgeId];
      return next;
    });
    setDraft((d) => {
      const next = { ...d };
      delete next[lodgeId];
      return next;
    });
  }

  return (
    <div>
      <input
        placeholder="Search by lodge name or region..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm mb-4"
      />
      {message && <p className="text-xs text-red-500 mb-3">{message}</p>}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden max-h-[70vh] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-neutral-500 text-xs uppercase sticky top-0">
            <tr>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Region</th>
              <th className="text-left px-4 py-3">Lodge default</th>
              <th className="text-left px-4 py-3">Your private rate</th>
              <th className="text-left px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => {
              const hasOwnRate = ratesByLodge[l.id] != null;
              const isDirty = draft[l.id] !== undefined && draft[l.id] !== (ratesByLodge[l.id] != null ? String(ratesByLodge[l.id]) : "");
              return (
                <tr key={l.id} className="border-t border-neutral-100 hover:bg-neutral-50">
                  <td className="px-4 py-2 font-medium text-neutral-900">{l.name}</td>
                  <td className="px-4 py-2 text-neutral-500">{l.region}</td>
                  <td className="px-4 py-2 text-neutral-500">{l.sto_disc != null ? `${l.sto_disc}%` : "—"}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        step="0.1"
                        placeholder="—"
                        value={valueFor(l.id)}
                        onChange={(e) => setDraft((d) => ({ ...d, [l.id]: e.target.value }))}
                        className="w-20 border border-neutral-300 rounded-lg px-2 py-1 text-sm"
                      />
                      <span className="text-neutral-400 text-xs">%</span>
                    </div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {isDirty && (
                      <button
                        onClick={() => handleSave(l.id)}
                        disabled={savingId === l.id}
                        className="text-xs text-white bg-neutral-900 px-2 py-1 rounded-md mr-2 disabled:opacity-50"
                      >
                        {savingId === l.id ? "Saving..." : "Save"}
                      </button>
                    )}
                    {hasOwnRate && !isDirty && (
                      <button
                        onClick={() => handleClear(l.id)}
                        disabled={savingId === l.id}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Clear
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-neutral-400 mt-2">{filtered.length} of {lodges.length} shown</p>
    </div>
  );
}
