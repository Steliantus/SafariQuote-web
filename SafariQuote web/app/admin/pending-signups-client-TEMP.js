"use client";

import { useState } from "react";
import { getPlan } from "@/lib/plans";

export default function PendingSignupsClient({ initialSignups }) {
  const [signups, setSignups] = useState(initialSignups);
  const [convertingId, setConvertingId] = useState(null);
  const [errors, setErrors] = useState({});

  async function handleConvert(signup) {
    setConvertingId(signup.id);
    setErrors((e) => ({ ...e, [signup.id]: "" }));

    const res = await fetch("/api/admin/pending-signups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: signup.id,
        companyName: signup.company_name,
        contactName: signup.contact_name,
        contactEmail: signup.contact_email,
        phone: signup.phone,
      }),
    });
    const body = await res.json();
    setConvertingId(null);

    if (!res.ok) {
      setErrors((e) => ({ ...e, [signup.id]: body.error || "Something went wrong." }));
      return;
    }
    if (body.warning) {
      setErrors((e) => ({ ...e, [signup.id]: body.warning }));
    }

    setSignups((list) => list.filter((s) => s.id !== signup.id));
  }

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-neutral-50 text-neutral-500 text-xs uppercase">
          <tr>
            <th className="text-left px-4 py-3">Company</th>
            <th className="text-left px-4 py-3">Contact</th>
            <th className="text-left px-4 py-3">Plan</th>
            <th className="text-left px-4 py-3">Signed up</th>
            <th className="text-left px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {signups.map((s) => {
            const plan = getPlan(s.plan);
            return (
              <tr key={s.id} className="border-t border-neutral-100 align-top">
                <td className="px-4 py-3 font-medium text-neutral-900">{s.company_name}</td>
                <td className="px-4 py-3 text-neutral-600">
                  {s.contact_name}
                  <br />
                  <span className="text-neutral-400">{s.contact_email}</span>
                  {s.phone && (
                    <>
                      <br />
                      <span className="text-neutral-400">{s.phone}</span>
                    </>
                  )}
                </td>
                <td className="px-4 py-3">
                  {plan ? (
                    <span className="text-xs px-2 py-1 rounded-full bg-neutral-100 text-neutral-700">
                      {plan.label} &middot; {plan.price}
                    </span>
                  ) : (
                    <span className="text-neutral-400">&mdash;</span>
                  )}
                </td>
                <td className="px-4 py-3 text-neutral-500">{formatDate(s.created_at)}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleConvert(s)}
                    disabled={convertingId === s.id}
                    className="bg-neutral-900 text-white text-xs px-3 py-1.5 rounded-lg disabled:opacity-50 whitespace-nowrap"
                  >
                    {convertingId === s.id ? "Converting..." : "Convert to tenant"}
                  </button>
                  {errors[s.id] && (
                    <p className="text-xs text-red-600 mt-1 max-w-[16rem]">{errors[s.id]}</p>
                  )}
                </td>
              </tr>
            );
          })}
          {signups.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-neutral-400">
                No pending signups.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
