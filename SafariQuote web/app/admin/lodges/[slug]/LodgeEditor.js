"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

// Edits the rack/STO figures inside a lodge's rooms[].rates{} structure --
// the day-to-day "a new rate sheet came in" workflow -- plus the handful of
// lodge-level fields Dana adjusts occasionally (STO default, agent note,
// activities-require-stay flag). A raw-JSON escape hatch covers structural
// edits (new rooms/seasons/activities) that this focused UI doesn't expose
// yet -- same "always confirm real data, never guess" spirit as the
// original tool.
export default function LodgeEditor({ lodge }) {
  const [data, setData] = useState(lodge.data);
  const [stoDisc, setStoDisc] = useState(lodge.sto_disc ?? "");
  const [activitiesRequireStay, setActivitiesRequireStay] = useState(lodge.activities_require_stay);
  const [agentNote, setAgentNote] = useState(lodge.agent_note || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showRaw, setShowRaw] = useState(false);
  const [rawText, setRawText] = useState(() => JSON.stringify(lodge.data, null, 2));
  const [rawError, setRawError] = useState("");

  function updateRoomRate(roomIdx, seasonKey, field, value) {
    setData((prev) => {
      const next = structuredClone(prev);
      next.rooms[roomIdx].rates[seasonKey][field] = value === "" ? 0 : Number(value);
      return next;
    });
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");
    let dataToSave = data;
    if (showRaw) {
      try {
        dataToSave = JSON.parse(rawText);
        setRawError("");
      } catch (e) {
        setRawError("Invalid JSON: " + e.message);
        setSaving(false);
        return;
      }
    }
    // Keep the JSONB copy of these fields in sync with the promoted columns --
    // lib/pricing.js reads lodge.stoDisc / lodge.activitiesRequireStay off the
    // `data` object itself, not the DB columns, so they must never drift apart.
    dataToSave = {
      ...dataToSave,
      stoDisc: stoDisc === "" ? undefined : Number(stoDisc),
      activitiesRequireStay: activitiesRequireStay,
      agentNote: agentNote || undefined,
    };
    const supabase = createClient();
    const { error } = await supabase
      .from("lodges")
      .update({
        data: dataToSave,
        sto_disc: stoDisc === "" ? null : Number(stoDisc),
        activities_require_stay: activitiesRequireStay,
        agent_note: agentNote || null,
      })
      .eq("id", lodge.id);
    setSaving(false);
    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage("Saved. Live for every tour operator's next draft calculation.");
      if (showRaw) setData(dataToSave);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-neutral-200 rounded-xl p-5 grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-neutral-600 mb-1">Default STO discount %</label>
          <input type="number" value={stoDisc} onChange={(e) => setStoDisc(e.target.value)}
            className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm" />
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input type="checkbox" checked={activitiesRequireStay}
              onChange={(e) => setActivitiesRequireStay(e.target.checked)} />
            Activities require an overnight stay
          </label>
        </div>
        <div className="col-span-3">
          <label className="block text-xs font-medium text-neutral-600 mb-1">Agent note</label>
          <textarea value={agentNote} onChange={(e) => setAgentNote(e.target.value)} rows={2}
            className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm" />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide">Room rates</h2>
        <button onClick={() => setShowRaw((s) => !s)} className="text-xs text-neutral-500 underline">
          {showRaw ? "Use rate table" : "Edit raw JSON (advanced)"}
        </button>
      </div>

      {showRaw ? (
        <div>
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            rows={24}
            className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-xs font-mono"
          />
          {rawError && <p className="text-sm text-red-600 mt-1">{rawError}</p>}
        </div>
      ) : (
        <div className="space-y-4">
          {(data.rooms || []).map((room, roomIdx) => (
            <div key={room.id} className="bg-white border border-neutral-200 rounded-xl p-5">
              <div className="font-medium text-neutral-900 mb-1">{room.label}</div>
              <div className="text-xs text-neutral-400 mb-3">{room.rateType} · {room.includes}</div>
              <table className="text-sm w-full">
                <thead className="text-xs text-neutral-500 uppercase">
                  <tr>
                    <th className="text-left py-1">Season</th>
                    <th className="text-left py-1">Rack</th>
                    <th className="text-left py-1">STO</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(room.rates || {}).map(([seasonKey, rate]) => (
                    <tr key={seasonKey} className="border-t border-neutral-100">
                      <td className="py-2 pr-4 text-neutral-600">
                        {data.seasons?.find((s) => s.id === seasonKey)?.label || seasonKey}
                      </td>
                      <td className="py-2 pr-4">
                        <input
                          type="number"
                          defaultValue={rate.rack}
                          onBlur={(e) => updateRoomRate(roomIdx, seasonKey, "rack", e.target.value)}
                          className="w-28 border border-neutral-300 rounded px-2 py-1"
                        />
                      </td>
                      <td className="py-2">
                        <input
                          type="number"
                          defaultValue={rate.sto}
                          onBlur={(e) => updateRoomRate(roomIdx, seasonKey, "sto", e.target.value)}
                          className="w-28 border border-neutral-300 rounded px-2 py-1"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
          {(!data.rooms || data.rooms.length === 0) && (
            <p className="text-sm text-neutral-400">No rooms loaded for this lodge yet.</p>
          )}
        </div>
      )}

      <div className="flex items-center gap-4">
        <button onClick={handleSave} disabled={saving}
          className="bg-neutral-900 text-white text-sm px-5 py-2 rounded-lg disabled:opacity-50">
          {saving ? "Saving..." : "Save changes"}
        </button>
        {message && <span className="text-sm text-neutral-600">{message}</span>}
      </div>
    </div>
  );
}
