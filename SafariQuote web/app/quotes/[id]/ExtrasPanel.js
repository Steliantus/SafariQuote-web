"use client";

import CarHirePicker from "./CarHirePicker";
import { MEET_GREET, FN_STOPS, fnLookupRate } from "@/lib/extras";

function uid() {
  return typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2);
}

// Everything that isn't a lodge stop's own accommodation/activities:
// standalone car hire, FlyNamibia sectors, ground handling & transfers, and
// itinerary extras (guide accommodation, park fees, water, free-form extra
// line items). See lib/extras.js for the pricing side of all of this.
export default function ExtrasPanel({ extras, onChange, isLocked, numGuests }) {
  const e = extras;

  function patch(p) {
    onChange({ ...e, ...p });
  }

  // -- Standalone car hire ---------------------------------------------------
  function addStandaloneCarHire() {
    patch({ standaloneCarHires: [...(e.standaloneCarHires || []), { key: uid() }] });
  }
  function updateStandaloneCarHire(key, next) {
    patch({ standaloneCarHires: (e.standaloneCarHires || []).map((c) => (c.key === key ? { ...next, key } : c)) });
  }
  function removeStandaloneCarHire(key) {
    patch({ standaloneCarHires: (e.standaloneCarHires || []).filter((c) => c.key !== key) });
  }

  // -- FlyNamibia sectors -----------------------------------------------------
  function addFnSector() {
    patch({ fnSectors: [...(e.fnSectors || []), { key: uid(), from: "", to: "" }] });
  }
  function updateFnSector(key, patchObj) {
    patch({ fnSectors: (e.fnSectors || []).map((s) => (s.key === key ? { ...s, ...patchObj } : s)) });
  }
  function removeFnSector(key) {
    patch({ fnSectors: (e.fnSectors || []).filter((s) => s.key !== key) });
  }

  // -- Extra line items ---------------------------------------------------
  function addExtraLineItem() {
    patch({ extraLineItems: [...(e.extraLineItems || []), { key: uid(), description: "", qty: 1, unit: "lump sum", rack: 0, sto: null }] });
  }
  function updateExtraLineItem(key, patchObj) {
    patch({ extraLineItems: (e.extraLineItems || []).map((x) => (x.key === key ? { ...x, ...patchObj } : x)) });
  }
  function removeExtraLineItem(key) {
    patch({ extraLineItems: (e.extraLineItems || []).filter((x) => x.key !== key) });
  }

  return (
    <div className="space-y-6">
      {/* Quote mode */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5">
        <label className="block text-xs font-medium text-neutral-600 mb-2">Quote mode</label>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={isLocked}
            onClick={() => patch({ quoteMode: "direct" })}
            className={`px-3 py-1.5 rounded-lg text-sm border ${(e.quoteMode || "direct") === "direct" ? "bg-neutral-900 text-white border-neutral-900" : "border-neutral-300 text-neutral-600"}`}
          >
            Direct
          </button>
          <button
            type="button"
            disabled={isLocked}
            onClick={() => patch({ quoteMode: "trade" })}
            className={`px-3 py-1.5 rounded-lg text-sm border ${e.quoteMode === "trade" ? "bg-neutral-900 text-white border-neutral-900" : "border-neutral-300 text-neutral-600"}`}
          >
            Trade
          </button>
        </div>
        <p className="text-xs text-neutral-400 mt-2">
          {(e.quoteMode || "direct") === "direct"
            ? "Rack rates — direct client quote."
            : "Trade partner quote — affects the quote reference code only; pricing is unchanged (matches the original tool, where trade pricing math was never wired up either)."}
        </p>
      </div>

      {/* Standalone car hire */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-neutral-700">Car hire (standalone)</h3>
        </div>
        <div className="space-y-3">
          {(e.standaloneCarHires || []).map((c) => (
            <div key={c.key} className="relative">
              <CarHirePicker
                value={c}
                disabled={isLocked}
                showOneWayFee
                onChange={(next) => updateStandaloneCarHire(c.key, next)}
                onRemove={() => removeStandaloneCarHire(c.key)}
              />
            </div>
          ))}
        </div>
        {!isLocked && (
          <button onClick={addStandaloneCarHire} className="mt-3 text-sm text-neutral-600 border border-dashed border-neutral-300 rounded-xl w-full py-2 hover:bg-neutral-50">
            + Add standalone car hire
          </button>
        )}
      </div>

      {/* Ground handling & transfers */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-neutral-700">Ground handling &amp; transfers</h3>

        <div>
          <label className="block text-xs font-medium text-neutral-600 mb-1">Meet &amp; greet</label>
          <select
            disabled={isLocked}
            value={e.meetGreetKey || "0"}
            onChange={(ev) => patch({ meetGreetKey: ev.target.value })}
            className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="0">— none —</option>
            {Object.entries(MEET_GREET).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label} (N${v.rack.toLocaleString()})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">Extra transfers / misc (NAD)</label>
            <input type="number" min={0} disabled={isLocked} value={e.extraTransfer || ""} placeholder="0"
              onChange={(ev) => patch({ extraTransfer: ev.target.value === "" ? 0 : +ev.target.value })}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">Go2 Namibia transfer (NAD)</label>
            <input type="number" min={0} disabled={isLocked} value={e.go2Extra || ""} placeholder="0"
              onChange={(ev) => patch({ go2Extra: ev.target.value === "" ? 0 : +ev.target.value })}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">Caprivi Adventures transfer (NAD)</label>
            <input type="number" min={0} disabled={isLocked} value={e.capriviExtra || ""} placeholder="0"
              onChange={(ev) => patch({ capriviExtra: ev.target.value === "" ? 0 : +ev.target.value })}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-600 mb-1">FlyNamibia Safari Circuit sectors</label>
          <div className="space-y-2">
            {(e.fnSectors || []).map((s) => {
              const rate = fnLookupRate(s.from, s.to);
              return (
                <div key={s.key} className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-lg p-2">
                  <select disabled={isLocked} value={s.from} onChange={(ev) => updateFnSector(s.key, { from: ev.target.value })}
                    className="flex-1 border border-neutral-300 rounded-lg px-2 py-1.5 text-sm bg-white">
                    <option value="">From…</option>
                    {FN_STOPS.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                  <select disabled={isLocked} value={s.to} onChange={(ev) => updateFnSector(s.key, { to: ev.target.value })}
                    className="flex-1 border border-neutral-300 rounded-lg px-2 py-1.5 text-sm bg-white">
                    <option value="">To…</option>
                    {FN_STOPS.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                  <span className="text-xs text-neutral-500 whitespace-nowrap">
                    {rate ? `N$${rate.rack.toLocaleString()} pp` : s.from && s.to ? "no scheduled rate" : ""}
                  </span>
                  {!isLocked && (
                    <button onClick={() => removeFnSector(s.key)} className="text-xs text-red-500 hover:underline">✕</button>
                  )}
                </div>
              );
            })}
          </div>
          {!isLocked && (
            <button onClick={addFnSector} className="mt-2 text-xs text-neutral-600 border border-dashed border-neutral-300 rounded-lg w-full py-1.5 hover:bg-neutral-50">
              + Add FlyNamibia sector
            </button>
          )}
          <p className="text-xs text-neutral-400 mt-1">Min 2 pax per sector. Priced per person × {numGuests} guest(s).</p>
        </div>
      </div>

      {/* Itinerary extras */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-neutral-700">Itinerary extras</h3>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">Freelance guide — nights</label>
            <input type="number" min={0} disabled={isLocked} value={e.guideNights || ""} placeholder="0"
              onChange={(ev) => patch({ guideNights: ev.target.value === "" ? 0 : +ev.target.value })}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">Guide accom. — Rack/night</label>
            <input type="number" min={0} disabled={isLocked} value={e.guideRack || ""} placeholder="0"
              onChange={(ev) => patch({ guideRack: ev.target.value === "" ? 0 : +ev.target.value })}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">Guide accom. — STO/night</label>
            <input type="number" min={0} disabled={isLocked} value={e.guideSto || ""} placeholder="same as rack"
              onChange={(ev) => patch({ guideSto: ev.target.value === "" ? 0 : +ev.target.value })}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">Park / conservation fees (NAD)</label>
            <input type="number" min={0} disabled={isLocked} value={e.parkFees || ""} placeholder="0"
              onChange={(ev) => patch({ parkFees: ev.target.value === "" ? 0 : +ev.target.value })}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">Drinking water enroute (NAD)</label>
            <input type="number" min={0} disabled={isLocked} value={e.waterCost || ""} placeholder="0"
              onChange={(ev) => patch({ waterCost: ev.target.value === "" ? 0 : +ev.target.value })}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-600 mb-1">Extra line items</label>
          <p className="text-xs text-neutral-400 mb-2">Custom extras, road transfers, scenic flights — anything not covered above. Leave STO blank for a NETT pass-through (same as rack).</p>
          <div className="space-y-2">
            {(e.extraLineItems || []).map((x) => (
              <div key={x.key} className="grid gap-2 items-end bg-neutral-50 border border-neutral-200 rounded-lg p-2" style={{ gridTemplateColumns: "1fr 70px 110px 90px 90px 24px" }}>
                <input type="text" disabled={isLocked} value={x.description} placeholder="Description"
                  onChange={(ev) => updateExtraLineItem(x.key, { description: ev.target.value })}
                  className="border border-neutral-300 rounded-lg px-2 py-1.5 text-sm bg-white" />
                <input type="number" min={1} disabled={isLocked} value={x.qty ?? 1}
                  onChange={(ev) => updateExtraLineItem(x.key, { qty: +ev.target.value || 1 })}
                  className="border border-neutral-300 rounded-lg px-2 py-1.5 text-sm bg-white" />
                <select disabled={isLocked} value={x.unit || "lump sum"} onChange={(ev) => updateExtraLineItem(x.key, { unit: ev.target.value })}
                  className="border border-neutral-300 rounded-lg px-2 py-1.5 text-sm bg-white">
                  <option value="lump sum">lump sum</option>
                  <option value="pp">per person</option>
                  <option value="per group">per group</option>
                  <option value="per vehicle">per vehicle</option>
                  <option value="per day">per day</option>
                </select>
                <input type="number" min={0} disabled={isLocked} value={x.rack || ""} placeholder="Rack"
                  onChange={(ev) => updateExtraLineItem(x.key, { rack: +ev.target.value || 0 })}
                  className="border border-neutral-300 rounded-lg px-2 py-1.5 text-sm bg-white" />
                <input type="number" min={0} disabled={isLocked} value={x.sto ?? ""} placeholder="= rack"
                  onChange={(ev) => updateExtraLineItem(x.key, { sto: ev.target.value === "" ? null : +ev.target.value })}
                  className="border border-neutral-300 rounded-lg px-2 py-1.5 text-sm bg-white" />
                {!isLocked && (
                  <button onClick={() => removeExtraLineItem(x.key)} className="text-xs text-red-500 hover:underline">✕</button>
                )}
              </div>
            ))}
          </div>
          {!isLocked && (
            <button onClick={addExtraLineItem} className="mt-2 text-xs text-neutral-600 border border-dashed border-neutral-300 rounded-lg w-full py-1.5 hover:bg-neutral-50">
              + Add extra line item
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
