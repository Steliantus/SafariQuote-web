"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { computeQuote, fmtNAD } from "@/lib/pricing";

function newStop(lodgeId) {
  return {
    key: crypto.randomUUID(),
    lodgeId,
    actOnly: false,
    roomIndex: 0,
    seasonId: null, // null = auto-detect from checkin
    numRooms: 1,
    checkin: "",
    checkout: "",
    singleSupp: false,
    paxOverride: null,
    selectedActivityIds: [],
    stoDiscOverride: null,
  };
}

export default function QuoteBuilder({ quote, lodgeList, travelers, tenantStoDiscount }) {
  const supabase = useMemo(() => createClient(), []);
  const isLocked = quote.status === "confirmed";

  const [clientName, setClientName] = useState(quote.client_name);
  const [travelerId, setTravelerId] = useState(quote.traveler_id || "");
  const [numGuests, setNumGuests] = useState((quote.guests || []).length || 2);
  const [stops, setStops] = useState(quote.stops || []);
  const [lodgesById, setLodgesById] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Preload lodges already referenced by this quote's saved stops.
  useEffect(() => {
    const ids = [...new Set((quote.stops || []).map((s) => s.lodgeId).filter(Boolean))];
    ids.forEach((id) => ensureLodgeLoaded(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ensureLodgeLoaded = useCallback(
    async (lodgeId) => {
      if (!lodgeId || lodgesById[lodgeId]) return;
      const { data } = await supabase.from("lodges").select("id, name, data").eq("id", lodgeId).single();
      if (data) {
        setLodgesById((prev) => ({ ...prev, [lodgeId]: data.data }));
      }
    },
    [supabase, lodgesById]
  );

  const guests = useMemo(() => Array.from({ length: Math.max(1, numGuests) }, (_, i) => ({ name: `Guest ${i + 1}` })), [numGuests]);

  const computed = useMemo(() => {
    if (isLocked) return quote.computed_snapshot;
    return computeQuote({ guests, stops }, lodgesById);
  }, [isLocked, quote.computed_snapshot, guests, stops, lodgesById]);

  function addStop() {
    setStops((s) => [...s, newStop(null)]);
  }

  function removeStop(key) {
    setStops((s) => s.filter((st) => st.key !== key));
  }

  function updateStop(key, patch) {
    setStops((s) => s.map((st) => (st.key === key ? { ...st, ...patch } : st)));
  }

  async function handleLodgeChange(key, lodgeId) {
    updateStop(key, { lodgeId, roomIndex: 0, seasonId: null, selectedActivityIds: [] });
    await ensureLodgeLoaded(lodgeId);
  }

  async function handleSave(nextStatus) {
    setSaving(true);
    setMessage("");
    const payload = {
      client_name: clientName,
      traveler_id: travelerId || null,
      guests,
      stops: stops.map(({ key, ...rest }) => rest), // strip client-only React key
    };
    if (nextStatus === "confirmed") {
      payload.status = "confirmed";
      payload.confirmed_at = new Date().toISOString();
      payload.computed_snapshot = computed;
    }
    const { error } = await supabase.from("quotes").update(payload).eq("id", quote.id);
    setSaving(false);
    if (error) setMessage(`Error: ${error.message}`);
    else setMessage(nextStatus === "confirmed" ? "Confirmed — price is now locked." : "Draft saved.");
  }

  return (
    <div className="grid grid-cols-3 gap-8">
      <div className="col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <input
            value={clientName}
            disabled={isLocked}
            onChange={(e) => setClientName(e.target.value)}
            className="text-2xl font-semibold text-neutral-900 bg-transparent border-b border-transparent focus:border-neutral-300 focus:outline-none disabled:opacity-70"
          />
          <span className={`text-xs px-2 py-1 rounded-full ${isLocked ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
            {quote.status}
          </span>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-5 grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">Traveler</label>
            <select disabled={isLocked} value={travelerId} onChange={(e) => setTravelerId(e.target.value)}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm">
              <option value="">— none linked —</option>
              {travelers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">Number of guests</label>
            <input type="number" min={1} disabled={isLocked} value={numGuests}
              onChange={(e) => setNumGuests(+e.target.value || 1)}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">Your STO discount</label>
            <div className="px-3 py-2 text-sm text-neutral-500">{tenantStoDiscount}% (set by Ondjamba)</div>
          </div>
        </div>

        <div className="space-y-4">
          {stops.map((stop, idx) => {
            const lodge = stop.lodgeId ? lodgesById[stop.lodgeId] : null;
            return (
              <div key={stop.key} className="bg-white border border-neutral-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-neutral-400 uppercase">Stop {idx + 1}</span>
                  {!isLocked && (
                    <button onClick={() => removeStop(stop.key)} className="text-xs text-red-500 hover:underline">Remove</button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 mb-1">Lodge</label>
                    <select disabled={isLocked} value={stop.lodgeId || ""} onChange={(e) => handleLodgeChange(stop.key, e.target.value)}
                      className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm">
                      <option value="">— select a lodge —</option>
                      {lodgeList.map((l) => <option key={l.id} value={l.id}>{l.name} — {l.region}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 mb-1">Check-in / Check-out</label>
                    <div className="flex gap-2">
                      <input type="date" disabled={isLocked} value={stop.checkin || ""} onChange={(e) => updateStop(stop.key, { checkin: e.target.value })}
                        className="w-full border border-neutral-300 rounded-lg px-2 py-2 text-sm" />
                      <input type="date" disabled={isLocked} value={stop.checkout || ""} onChange={(e) => updateStop(stop.key, { checkout: e.target.value })}
                        className="w-full border border-neutral-300 rounded-lg px-2 py-2 text-sm" />
                    </div>
                  </div>
                </div>

                {lodge && (
                  <>
                    <label className="flex items-center gap-2 text-sm text-neutral-700 mb-3">
                      <input type="checkbox" disabled={isLocked || lodge.activitiesRequireStay} checked={stop.actOnly}
                        onChange={(e) => updateStop(stop.key, { actOnly: e.target.checked })} />
                      Activities only — no room booked
                      {lodge.activitiesRequireStay && <span className="text-xs text-neutral-400">(this lodge requires a stay)</span>}
                    </label>

                    {!stop.actOnly && (
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div>
                          <label className="block text-xs font-medium text-neutral-600 mb-1">Room</label>
                          <select disabled={isLocked} value={stop.roomIndex} onChange={(e) => updateStop(stop.key, { roomIndex: +e.target.value })}
                            className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm">
                            {(lodge.rooms || []).map((r, i) => <option key={r.id} value={i}>{r.label}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-neutral-600 mb-1">Rooms</label>
                          <input type="number" min={1} disabled={isLocked} value={stop.numRooms}
                            onChange={(e) => updateStop(stop.key, { numRooms: +e.target.value || 1 })}
                            className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <label className="flex items-center gap-2 text-sm text-neutral-700 mt-6">
                          <input type="checkbox" disabled={isLocked} checked={stop.singleSupp}
                            onChange={(e) => updateStop(stop.key, { singleSupp: e.target.checked })} />
                          Single supplement
                        </label>
                      </div>
                    )}

                    {(lodge.activities || []).filter((a) => a.rack > 0).length > 0 && (
                      <div className="mb-2">
                        <label className="block text-xs font-medium text-neutral-600 mb-1">Activities</label>
                        <div className="flex flex-wrap gap-3">
                          {lodge.activities.filter((a) => a.rack > 0).map((a) => (
                            <label key={a.id} className="flex items-center gap-1.5 text-xs text-neutral-600">
                              <input
                                type="checkbox"
                                disabled={isLocked}
                                checked={stop.selectedActivityIds?.includes(a.id) || false}
                                onChange={(e) => {
                                  const cur = new Set(stop.selectedActivityIds || []);
                                  e.target.checked ? cur.add(a.id) : cur.delete(a.id);
                                  updateStop(stop.key, { selectedActivityIds: [...cur] });
                                }}
                              />
                              {a.label}
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        {!isLocked && (
          <button onClick={addStop} className="text-sm text-neutral-600 border border-dashed border-neutral-300 rounded-xl w-full py-3 hover:bg-neutral-50">
            + Add stop
          </button>
        )}
      </div>

      <div className="col-span-1">
        <div className="bg-white border border-neutral-200 rounded-xl p-5 sticky top-6">
          <h2 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide mb-4">Quote total</h2>
          {(!computed || computed.lines.length === 0) ? (
            <p className="text-sm text-neutral-400">Add a stop to see pricing.</p>
          ) : (
            <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
              {computed.lines.map((line, i) =>
                line.stopSec ? (
                  <div key={i} className="text-xs font-semibold text-neutral-400 uppercase pt-2">{line.label}</div>
                ) : (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-neutral-600">{line.label}<br /><span className="text-xs text-neutral-400">{line.detail}</span></span>
                    <span className="text-neutral-900 font-medium whitespace-nowrap">{fmtNAD(line.sto)}</span>
                  </div>
                )
              )}
            </div>
          )}
          <div className="border-t border-neutral-200 pt-3 space-y-1">
            <div className="flex justify-between text-sm text-neutral-500">
              <span>Rack total</span><span>{fmtNAD(computed?.rackTotal || 0)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-neutral-900">
              <span>Client total (STO)</span><span>{fmtNAD(computed?.stoTotal || 0)}</span>
            </div>
          </div>
          {!isLocked ? (
            <div className="mt-5 space-y-2">
              <button onClick={() => handleSave("draft")} disabled={saving}
                className="w-full border border-neutral-300 text-neutral-700 text-sm py-2 rounded-lg disabled:opacity-50">
                {saving ? "Saving..." : "Save draft"}
              </button>
              <button onClick={() => handleSave("confirmed")} disabled={saving}
                className="w-full bg-neutral-900 text-white text-sm py-2 rounded-lg disabled:opacity-50">
                Confirm & lock price
              </button>
            </div>
          ) : (
            <p className="text-xs text-neutral-400 mt-4">
              Confirmed {quote.confirmed_at ? new Date(quote.confirmed_at).toLocaleDateString() : ""} — price is locked and won't change if lodge rates update later.
            </p>
          )}
          {message && <p className="text-xs text-neutral-500 mt-3">{message}</p>}
        </div>
      </div>
    </div>
  );
}
