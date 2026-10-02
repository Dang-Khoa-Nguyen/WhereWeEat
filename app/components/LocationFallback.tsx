"use client";

import { useState } from "react";
import { useApp } from "@/app/context/AppContext";

// Shown only when the browser couldn't give us the user's location.
// Lets them type an address instead, which we geocode via Nominatim.
export default function LocationFallback() {
  const { locationError, setManualLocation } = useApp();
  const [address, setAddress] = useState("");
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState(false);

  if (!locationError) return null;

  async function submit() {
    if (!address.trim()) return;
    setBusy(true);
    const success = await setManualLocation(address.trim());
    setBusy(false);
    setOk(success);
  }

  return (
    <div className="my-3 rounded-lg border border-[#e76268] bg-[#ffe9ea] p-3 text-sm text-[#7a1f24]">
      <p className="mb-2">📍 {locationError}</p>

      <div className="flex gap-2">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
          placeholder="e.g. Rundle Mall, Adelaide"
          aria-label="Enter your location"
          className="flex-1 rounded-lg border border-[#193948] px-3 py-2 bg-white
                     focus:outline-none focus:ring-2 focus:ring-[#e76268]"
        />
        <button
          onClick={submit}
          disabled={busy}
          className={`rounded-lg px-4 py-2 text-white bg-[#e76268] ${busy ? "opacity-50 cursor-wait" : "cursor-pointer"}`}>
          {busy ? "Finding…" : "Use address"}
        </button>
      </div>

      {ok && <p className="mt-2 text-green-700">Location set — now tap Find or Random.</p>}
    </div>
  );
}
