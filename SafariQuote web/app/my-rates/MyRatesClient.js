"use client";

import { useRef, useState } from "react";

export default function MyRatesClient({ isDemo, isMasterRateSource, mySubmissions }) {
  const fileInput = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  if (isDemo) {
    return (
      <div className="bg-white border border-neutral-200 rounded-xl p-6 text-sm text-neutral-500 max-w-2xl">
        Trial accounts quote off a frozen demo rate book with a flat 10% STO baked in — there&apos;s nothing to
        negotiate here. A real account gets its own spreadsheet to set per-lodge rates.
      </div>
    );
  }

  if (isMasterRateSource) {
    return (
      <div className="bg-white border border-neutral-200 rounded-xl p-6 text-sm text-neutral-500 max-w-2xl">
        Your account uses each lodge&apos;s own contracted rate directly, so there&apos;s no rate sheet to fill in here.
      </div>
    );
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/my-rates/upload", {
        method: "POST",
        headers: { "Content-Type": "application/octet-stream" },
        body: file,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload failed.");
      } else {
        setResult(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-white border border-neutral-200 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide mb-3">1. Download</h2>
        <p className="text-sm text-neutral-500 mb-4">
          Every lodge in SafariQuote, with your default STO% already filled in. Only change a row where you
          have your own negotiated rate with that lodge.
        </p>
        <a
          href="/api/my-rates/template"
          className="inline-block bg-neutral-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-neutral-800"
        >
          Download my STO rates spreadsheet
        </a>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide mb-3">2. Upload</h2>
        <p className="text-sm text-neutral-500 mb-4">
          Fill it in and upload it here — your rate changes are saved immediately, and any lodges you added on
          the &quot;Add New Lodges&quot; tab are sent to our team to add properly.
        </p>
        <input
          ref={fileInput}
          type="file"
          accept=".xlsx"
          disabled={uploading}
          onChange={handleUpload}
          className="text-sm text-neutral-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-neutral-100 file:text-neutral-700 file:text-sm hover:file:bg-neutral-200 disabled:opacity-50"
        />
        {uploading && <p className="text-xs text-neutral-400 mt-2">Uploading…</p>}
        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
        {result && (
          <div className="text-xs text-neutral-600 mt-3 space-y-1">
            <p>✓ Saved {result.ratesSaved} rate{result.ratesSaved === 1 ? "" : "s"}.</p>
            {result.newLodgesSubmitted > 0 && (
              <p>
                ✓ Sent {result.newLodgesSubmitted} new lodge{result.newLodgesSubmitted === 1 ? "" : "s"} to our
                team for review.
              </p>
            )}
            {result.newLodgesFeaturePending && (
              <p className="text-amber-600">
                New-lodge submissions aren&apos;t being accepted yet — check back soon, or email us the details
                directly for now.
              </p>
            )}
            {result.errors?.length > 0 && (
              <ul className="list-disc list-inside text-amber-600">
                {result.errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {mySubmissions.length > 0 && (
        <div className="bg-white border border-neutral-200 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide mb-3">Your lodge submissions</h2>
          <div className="divide-y divide-neutral-100">
            {mySubmissions.map((s) => (
              <div key={s.id} className="py-2 flex items-center justify-between text-sm">
                <div>
                  <span className="font-medium text-neutral-900">{s.lodge_name}</span>
                  {s.region && <span className="text-neutral-400"> — {s.region}</span>}
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    s.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : s.status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
