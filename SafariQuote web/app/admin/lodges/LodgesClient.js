"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

export default function LodgesClient({ lodges }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    if (!q.trim()) return lodges;
    const needle = q.toLowerCase();
    return lodges.filter(
      (l) => l.name.toLowerCase().includes(needle) || (l.region || "").toLowerCase().includes(needle)
    );
  }, [q, lodges]);

  return (
    <div>
      <input
        placeholder="Search by lodge name or region..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm mb-4"
      />
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden max-h-[70vh] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-neutral-500 text-xs uppercase sticky top-0">
            <tr>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Region</th>
              <th className="text-left px-4 py-3">STO disc.</th>
              <th className="text-left px-4 py-3">Currency</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => (
              <tr key={l.slug} className="border-t border-neutral-100 hover:bg-neutral-50">
                <td className="px-4 py-2">
                  <Link href={`/admin/lodges/${l.slug}`} className="font-medium text-neutral-900 hover:underline">
                    {l.name}
                  </Link>
                </td>
                <td className="px-4 py-2 text-neutral-500">{l.region}</td>
                <td className="px-4 py-2 text-neutral-500">{l.sto_disc != null ? `${l.sto_disc}%` : "—"}</td>
                <td className="px-4 py-2 text-neutral-500">{l.currency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-neutral-400 mt-2">{filtered.length} of {lodges.length} shown</p>
    </div>
  );
}
