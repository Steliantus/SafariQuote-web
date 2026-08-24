"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function TravelersClient({ initialTravelers }) {
  const [travelers, setTravelers] = useState(initialTravelers);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [saving, setSaving] = useState(false);

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    const { data, error } = await supabase.from("travelers").insert(form).select().single();
    setSaving(false);
    if (!error) {
      setTravelers((t) => [data, ...t]);
      setForm({ name: "", email: "", phone: "", notes: "" });
      setShowForm(false);
    }
  }

  async function handleDelete(id) {
    const supabase = createClient();
    setTravelers((t) => t.filter((x) => x.id !== id));
    await supabase.from("travelers").delete().eq("id", id);
  }

  return (
    <div>
      <button onClick={() => setShowForm((s) => !s)} className="mb-4 bg-neutral-900 text-white text-sm px-4 py-2 rounded-lg">
        {showForm ? "Cancel" : "+ Add traveler"}
      </button>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white border border-neutral-200 rounded-xl p-5 mb-6 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">Phone</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">Notes</label>
            <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="col-span-2">
            <button type="submit" disabled={saving} className="bg-neutral-900 text-white text-sm px-4 py-2 rounded-lg disabled:opacity-50">
              {saving ? "Saving..." : "Save traveler"}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white border border-neutral-200 rounded-xl divide-y divide-neutral-100">
        {travelers.map((t) => (
          <div key={t.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <div className="text-sm font-medium text-neutral-900">{t.name}</div>
              <div className="text-xs text-neutral-500">{t.email} {t.phone && `· ${t.phone}`}</div>
            </div>
            <button onClick={() => handleDelete(t.id)} className="text-xs text-red-500 hover:underline">Delete</button>
          </div>
        ))}
        {travelers.length === 0 && <div className="px-4 py-8 text-center text-neutral-400 text-sm">No travelers yet.</div>}
      </div>
    </div>
  );
}
