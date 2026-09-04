"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { computeQuote, fmtNAD } from "@/lib/pricing";
import { emptyExtras } from "@/lib/extras";
import CarHirePicker from "./CarHirePicker";
import ExtrasPanel from "./ExtrasPanel";
import { downloadQuotePdf } from "./quotePdf";

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

export default function QuoteBuilder({ quote, lodgeList, travelers, tenantStoDiscount, tenantId, isDemo, isMasterRateSource, companyName }) {
  const supabase = useMemo(() => createClient(), []);
  const isLocked = quote.status === "confirmed";

  const [clientName, setClientName] = useState(quote.client_name);
  const [travelerId, setTravelerId] = useState(quote.traveler_id || "");
  const [numGuests, setNumGuests] = useState((quote.guests || []).length || 2);
  const [stops, setStops] = useState(quote.stops || []);
  const [extras, setExtras] = useState(quote.extras && Object.keys(quote.extras).length ? quote.extras : emptyExtras());
  const [exporting, setExporting] = useState(false);
  const [lodgesById, setLodgesById] = useState({});
  // Your own private per-lodge STO% (from tenant_lodge_rates) — SafariQuote can't
  // read this table at all, so this is fetched with the regular RLS-bound
  // client, scoped to your own tenant_id only.
  const [myRatesByLodge, setMyRatesByLodge] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Preload lodges (and your own saved rates for them) already referenced by
  // this quote's saved stops.
  useEffect(() => {
    const ids = [...new Set((quote.stops || []).map((s) => s.lodgeId).filter(Boolean))];
    ids.forEach((id) => {
      ensureLodgeLoaded(id);
      ensureMyRateLoaded(id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ensureLodgeLoaded = useCallback(
    async (lodgeId) => {
      if (!lodgeId) return null;
      if (lodgesById[lodgeId]) return lodgesById[lodgeId];
      // Trial sessions read from the frozen demo dataset (a JSON file on
      // disk) via a small API route instead of the live `lodges` table —
      // see app/api/demo-lodge/[id]/route.js and lib/demo.js.
      if (isDemo) {
        const res = await fetch(`/api/demo-lodge/${encodeURIComponent(lodgeId)}`);
        if (res.ok) {
          const data = await res.json();
          // `data.name` lives alongside (not inside) `data.data` — merge it
          // in so pricing.js's `lodge.name` (used in the price-breakdown
          // labels) isn't left undefined.
          const merged = { ...data.data, name: data.name };
          setLodgesById((prev) => ({ ...prev, [lodgeId]: merged }));
          return merged;
        }
        return null;
      }
      const { data } = await supabase.from("lodges").select("id, name, data").eq("id", lodgeId).single();
      if (data) {
        const merged = { ...data.data, name: data.name };
        setLodgesById((prev) => ({ ...prev, [lodgeId]: merged }));
        return merged;
      }
      return null;
    },
    [supabase, lodgesById, isDemo]
  );

  const ensureMyRateLoaded = useCallback(
    async (lodgeId) => {
      // Demo lodges already carry the flat 10% STO baked into every rate —
      // there's no tenant_lodge_rates row for a synthetic demo lodge id, and
      // no need for one.
      if (isDemo) return null;
      if (!lodgeId || !tenantId || myRatesByLodge[lodgeId] !== undefined) return myRatesByLodge[lodgeId];
      const { data } = await supabase
        .from("tenant_lodge_rates")
        .select("sto_disc")
        .eq("tenant_id", tenantId)
        .eq("lodge_id", lodgeId)
        .maybeSingle();
      const val = data?.sto_disc ?? null;
      setMyRatesByLodge((prev) => ({ ...prev, [lodgeId]: val }));
      return val;
    },
    [supabase, tenantId, myRatesByLodge, isDemo]
  );

  async function handleRememberRate(lodgeId, value) {
    if (!tenantId || !lodgeId || value == null || Number.isNaN(value)) return;
    const { error } = await supabase
      .from("tenant_lodge_rates")
      .upsert({ tenant_id: tenantId, lodge_id: lodgeId, sto_disc: value }, { onConflict: "tenant_id,lodge_id" });
    if (!error) {
      setMyRatesByLodge((prev) => ({ ...prev, [lodgeId]: value }));
      setMessage("Saved as your standing rate for this lodge — private to your account.");
    }
  }

  const guests = useMemo(() => Array.from({ length: Math.max(1, numGuests) }, (_, i) => ({ name: `Guest ${i + 1}` })), [numGuests]);

  const computed = useMemo(() => {
    if (isLocked) return quote.computed_snapshot;
    return computeQuote({ guests, stops, extras }, lodgesById);
  }, [isLocked, quote.computed_snapshot, guests, stops, extras, lodgesById]);

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
    updateStop(key, { lodgeId, roomIndex: 0, seasonId: null, selectedActivityIds: [], stoDiscOverride: null });
    const lodge = await ensureLodgeLoaded(lodgeId);
    const myRate = await ensureMyRateLoaded(lodgeId);
    if (myRate != null) {
      // You've negotiated and saved your own rate at this lodge before — use it.
      updateStop(key, { stoDiscOverride: myRate });
    } else if (!isDemo && isMasterRateSource === false && lodge) {
      // No standing rate on file. `lodge.stoDisc` here is Ondjamba's own
      // contracted rate with this property, sent to us directly by the
      // lodge — it isn't yours to use by default. Cap the default shown to
      // your account's negotiated ceiling (tenantStoDiscount), and never
      // *above* the lodge's own stated rate (e.g. a lodge stated at 0%
      // stays 0% for everyone, not just Ondjamba).
      // isMasterRateSource is `null` (not `false`) until the DB migration
      // adding this flag has run — checking `=== false` strictly means this
      // capping only ever activates once we positively know the tenant
      // isn't Ondjamba, so nothing changes for anyone until then.
      const lodgeDefault = typeof lodge.stoDisc === "number" ? lodge.stoDisc : 20;
      const capped = Math.min(lodgeDefault, tenantStoDiscount);
      updateStop(key, { stoDiscOverride: capped });
    }
  }

  async function handleSave(nextStatus) {
    setSaving(true);
    setMessage("");
    const payload = {
      client_name: clientName,
      traveler_id: travelerId || null,
      guests,
      stops: stops.map(({ key, ...rest }) => rest), // strip client-only React key
      extras,
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

  function handleDownloadPdf() {
    downloadQuotePdf({ computed, clientName, numGuests, stops, companyName: isDemo ? "" : companyName });
  }

  async function handleExportExcel() {
    setExporting(true);
    setMessage("");
    try {
      const res = await fetch(`/api/quotes/${quote.id}/export-xlsx`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setMessage(body.error || "Could not export to Excel.");
        return;
      }
      const blob = await res.blob();
      const cd = res.headers.get("Content-Disposition") || "";
      const match = cd.match(/filename="([^"]+)"/);
      const filename = match ? match[1] : "SafariQuote.xlsx";
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
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
            <div className="px-3 py-2 text-sm text-neutral-500">
              {isDemo
                ? `${tenantStoDiscount}% (fixed for the trial — a real account negotiates its own rate per lodge)`
                : isMasterRateSource === true
                ? "Uses each lodge's own contracted rate directly"
                : `${tenantStoDiscount}% default ceiling — capped to each lodge's own rate where it's lower. Set your own per lodge below, or on the My Rates page.`}
            </div>
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
                      <input type="date" disabled={isLocked} value={stop.checkin || ""}
                        min={isDemo ? "2026-01-01" : undefined} max={isDemo ? "2026-12-31" : undefined}
                        onChange={(e) => updateStop(stop.key, { checkin: e.target.value })}
                        className="w-full border border-neutral-300 rounded-lg px-2 py-2 text-sm" />
                      <input type="date" disabled={isLocked} value={stop.checkout || ""}
                        min={isDemo ? "2026-01-01" : undefined} max={isDemo ? "2026-12-31" : undefined}
                        onChange={(e) => updateStop(stop.key, { checkout: e.target.value })}
                        className="w-full border border-neutral-300 rounded-lg px-2 py-2 text-sm" />
                    </div>
                    {isDemo && <p className="text-xs text-neutral-400 mt-1">Trial data covers 2026 dates only.</p>}
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

                    {!stop.actOnly && (
                      <div className="mb-3">
                        <label className="block text-xs font-medium text-neutral-600 mb-1">Your STO % at this lodge</label>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              step="0.1"
                              disabled={isLocked}
                              placeholder={typeof lodge.stoDisc === "number" ? String(lodge.stoDisc) : "20"}
                              value={stop.stoDiscOverride ?? ""}
                              onChange={(e) =>
                                updateStop(stop.key, {
                                  stoDiscOverride: e.target.value === "" ? null : +e.target.value,
                                })
                              }
                              className="w-20 border border-neutral-300 rounded-lg px-2 py-1 text-sm"
                            />
                            <span className="text-neutral-400 text-xs">%</span>
                          </div>
                          {!isLocked && (
                            <button
                              type="button"
                              disabled={stop.stoDiscOverride == null || Number.isNaN(stop.stoDiscOverride)}
                              onClick={() => handleRememberRate(stop.lodgeId, stop.stoDiscOverride)}
                              className="text-xs text-neutral-500 hover:underline disabled:opacity-40"
                            >
                              Remember for next time
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-neutral-400 mt-1">
                          Private to your account — SafariQuote can&apos;t see this number.
                        </p>
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

                    <div className="mb-2">
                      <label className="block text-xs font-medium text-neutral-600 mb-1">Car hire at this stop</label>
                      {stop.carHire ? (
                        <CarHirePicker
                          value={stop.carHire}
                          disabled={isLocked}
                          onChange={(next) => updateStop(stop.key, { carHire: next })}
                          onRemove={() => updateStop(stop.key, { carHire: null })}
                        />
                      ) : (
                        !isLocked && (
                          <button
                            type="button"
                            onClick={() => updateStop(stop.key, { carHire: {} })}
                            className="text-xs text-neutral-600 border border-dashed border-neutral-300 rounded-lg w-full py-1.5 hover:bg-neutral-50"
                          >
                            + Add car hire
                          </button>
                        )
                      )}
                    </div>
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

        <ExtrasPanel extras={extras} onChange={setExtras} isLocked={isLocked} numGuests={numGuests} />
      </div>

      <div className="col-span-1">
        <div className="bg-white border border-neutral-200 rounded-xl p-5 sticky top-6">
          <h2 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide mb-4">Quote total</h2>
          {(!computed || computed.lines.length === 0) ? (
            <p className="text-sm text-neutral-400">Add a stop to see pricing.</p>
          ) : (
            <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
              {computed.lines.map((line, i) => {
                if (line.zero) return null;
                if (line.stopSec) {
                  return <div key={i} className="text-xs font-semibold text-neutral-400 uppercase pt-2">{line.label}</div>;
                }
                if (line.sec) {
                  return <div key={i} className="text-xs font-semibold text-amber-700 uppercase pt-3 border-t border-neutral-100 mt-1">{line.sec}</div>;
                }
                return (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-neutral-600">{line.label}<br /><span className="text-xs text-neutral-400">{line.detail}</span></span>
                    <span className="text-neutral-900 font-medium whitespace-nowrap">{fmtNAD(line.sto)}</span>
                  </div>
                );
              })}
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
          <div className="mt-2 space-y-2">
            <button onClick={handleDownloadPdf} disabled={!computed || !computed.rackTotal}
              className="w-full border border-neutral-300 text-neutral-700 text-sm py-2 rounded-lg disabled:opacity-50">
              Download PDF
            </button>
            <button onClick={handleExportExcel} disabled={exporting}
              className="w-full border border-neutral-300 text-neutral-700 text-sm py-2 rounded-lg disabled:opacity-50">
              {exporting ? "Preparing…" : "Export to Excel (rack + STO)"}
            </button>
          </div>
          {message && <p className="text-xs text-neutral-500 mt-3">{message}</p>}
        </div>
      </div>
    </div>
  );
}
