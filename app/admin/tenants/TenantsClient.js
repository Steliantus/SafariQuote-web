"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function TenantsClient({ initialTenants }) {
  const [tenants, setTenants] = useState(initialTenants);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ companyName: "", contactName: "", contactEmail: "", phone: "", stoDiscountPct: 10 });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/admin/tenants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const body = await res.json();
    setSaving(false);
    if (!res.ok) {
      setMessage(`Error: ${body.error}`);
      return;
    }
    if (body.warning) setMessage(body.warning);
    else setMessage(`Invite sent to ${form.contactEmail}.`);
    setTenants((t) => [body.tenant, ...t]);
    setForm({ companyName: "", contactName: "", contactEmail: "", phone: "", stoDiscountPct: 10 });
    setShowForm(false);
  }

  async function updateStoDiscount(id, value) {
    const supabase = createClient();
    setTenants((t) => t.map((x) => (x.id === id ? { ...x, sto_discount_pct: value } : x)));
    await supabase.from("tenants").update({ sto_discount_pct: value }).eq("id", id);
  }

  async function toggleStatus(id, current) {
    const next = current === "active" ? "suspended" : "active";
    const supabase = createClient();
    setTenants((t) => t.map((x) => (x.id === id ? { ...x, status: next } : x)));
    await supabase.from("tenants").update({ status: next }).eq("id", id);
  }

  return (
    <div>
      <button
        onClick={() => setShowForm((s) => !s)}
        className="mb-4 bg-neutral-900 text-white text-sm px-4 py-2 rounded-lg"
      >
        {showForm ? "Cancel" : "+ Add tour operator"}
      </button>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white border border-neutral-200 rounded-xl p-5 mb-6 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">Company name</label>
            <input required value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">Contact name</label>
            <input value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">Contact email (invite sent here)</label>
            <input required type="email" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">Phone</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">STO discount %</label>
            <input type="number" value={form.stoDiscountPct}
              onChange={(e) => setForm({ ...form, stoDiscountPct: +e.target.value })}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="col-span-2">
            <button type="submit" disabled={saving} className="bg-neutral-900 text-white text-sm px-4 py-2 rounded-lg disabled:opacity-50">
              {saving ? "Sending invite..." : "Create & send invite"}
            </button>
          </div>
        </form>
      )}

      {message && <p className="text-sm text-neutral-600 mb-4">{message}</p>}

      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-neutral-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Company</th>
              <th className="text-left px-4 py-3">Contact</th>
              <th className="text-left px-4 py-3">STO %</th>
              <th className="text-left px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((t) => (
              <tr key={t.id} className="border-t border-neutral-100">
                <td className="px-4 py-3 font-medium text-neutral-900">{t.company_name}</td>
                <td className="px-4 py-3 text-neutral-600">
                  {t.contact_name} <span className="text-neutral-400">· {t.contact_email}</span>
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    defaultValue={t.sto_discount_pct}
                    onBlur={(e) => updateStoDiscount(t.id, +e.target.value)}
                    className="w-20 border border-neutral-300 rounded px-2 py-1"
                  />
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleStatus(t.id, t.status)}
                    className={`text-xs px-2 py-1 rounded-full ${t.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                  >
                    {t.status}
                  </button>
                </td>
              </tr>
            ))}
            {tenants.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-neutral-400">
                  No tour operators yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
