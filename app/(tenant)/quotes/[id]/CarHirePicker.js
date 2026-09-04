"use client";

import { CAR_HIRE_COMPANIES, calcCarHire } from "@/lib/carHire";

const COMPANY_KEYS = Object.keys(CAR_HIRE_COMPANIES);

// One car-hire line — used both attached to a lodge stop and standalone
// (itinerary-level, e.g. a self-drive leg before/after the lodge circuit).
// `value` is null/undefined when no car hire is attached yet.
export default function CarHirePicker({ value, onChange, onRemove, disabled, showOneWayFee = false }) {
  const v = value || {};
  const co = v.companyKey ? CAR_HIRE_COMPANIES[v.companyKey] : null;
  const calc = co ? calcCarHire(v.companyKey, v.vehicleId, v.pickupDate, v.dropoffDate) : null;

  function patch(p) {
    onChange({ ...v, ...p });
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium text-neutral-600 mb-1">Company</label>
          <select
            disabled={disabled}
            value={v.companyKey || ""}
            onChange={(e) => patch({ companyKey: e.target.value || null, vehicleId: null })}
            className="w-full border border-neutral-300 rounded-lg px-2 py-1.5 text-sm bg-white"
          >
            <option value="">— select a company —</option>
            {COMPANY_KEYS.map((k) => (
              <option key={k} value={k}>
                {CAR_HIRE_COMPANIES[k].name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-600 mb-1">Vehicle</label>
          <select
            disabled={disabled || !co}
            value={v.vehicleId || ""}
            onChange={(e) => patch({ vehicleId: e.target.value || null })}
            className="w-full border border-neutral-300 rounded-lg px-2 py-1.5 text-sm bg-white"
          >
            <option value="">— select a vehicle —</option>
            {(co?.vehicles || []).map((veh) => (
              <option key={veh.id} value={veh.id}>
                {veh.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium text-neutral-600 mb-1">Pick-up date</label>
          <input
            type="date"
            disabled={disabled}
            value={v.pickupDate || ""}
            onChange={(e) => patch({ pickupDate: e.target.value })}
            className="w-full border border-neutral-300 rounded-lg px-2 py-1.5 text-sm bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-600 mb-1">Drop-off date</label>
          <input
            type="date"
            disabled={disabled}
            value={v.dropoffDate || ""}
            onChange={(e) => patch({ dropoffDate: e.target.value })}
            className="w-full border border-neutral-300 rounded-lg px-2 py-1.5 text-sm bg-white"
          />
        </div>
      </div>

      {showOneWayFee && (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">One-way fee — Rack (NAD)</label>
            <input
              type="number"
              min={0}
              disabled={disabled}
              value={v.oneWayRack ?? ""}
              placeholder="0"
              onChange={(e) => patch({ oneWayRack: e.target.value === "" ? 0 : +e.target.value })}
              className="w-full border border-neutral-300 rounded-lg px-2 py-1.5 text-sm bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">One-way fee — STO (NAD)</label>
            <input
              type="number"
              min={0}
              disabled={disabled}
              value={v.oneWaySto ?? ""}
              placeholder="same as rack"
              onChange={(e) => patch({ oneWaySto: e.target.value === "" ? 0 : +e.target.value })}
              className="w-full border border-neutral-300 rounded-lg px-2 py-1.5 text-sm bg-white"
            />
          </div>
        </div>
      )}

      <details className="text-xs">
        <summary className="cursor-pointer text-blue-700">Override daily rate</summary>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div>
            <label className="block text-neutral-600 mb-1">Rack / day (NAD)</label>
            <input
              type="number"
              min={0}
              disabled={disabled}
              value={v.overrideRack ?? ""}
              placeholder={calc ? String(Math.round(calc.rackDay)) : "auto"}
              onChange={(e) => patch({ overrideRack: e.target.value === "" ? null : +e.target.value })}
              className="w-full border border-neutral-300 rounded-lg px-2 py-1 text-sm bg-white"
            />
          </div>
          <div>
            <label className="block text-neutral-600 mb-1">STO / day (NAD)</label>
            <input
              type="number"
              min={0}
              disabled={disabled}
              value={v.overrideSto ?? ""}
              placeholder={calc ? String(Math.round(calc.stoDay)) : "auto"}
              onChange={(e) => patch({ overrideSto: e.target.value === "" ? null : +e.target.value })}
              className="w-full border border-neutral-300 rounded-lg px-2 py-1 text-sm bg-white"
            />
          </div>
        </div>
      </details>

      <div className="text-xs">
        {calc ? (
          <span className="text-green-700">
            ✓ {calc.days} day(s) · {calc.season === "high" ? "High" : "Low"} season · N${Math.round(v.overrideRack ?? calc.rackDay).toLocaleString()}/day rack
          </span>
        ) : v.companyKey && v.vehicleId ? (
          <span className="text-amber-700">⚠ No rate for these dates — check pick-up/drop-off.</span>
        ) : (
          <span className="text-neutral-400">Select a company, vehicle, and dates.</span>
        )}
      </div>

      {!disabled && onRemove && (
        <button type="button" onClick={onRemove} className="text-xs text-red-500 hover:underline">
          Remove car hire
        </button>
      )}
    </div>
  );
}
