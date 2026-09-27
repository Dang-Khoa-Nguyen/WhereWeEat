"use client";

import { useState } from "react";
import { API_URL } from "@/lib/api";

// Powers the "Find restaurants" flow: geolocate the user, then fetch
// a filtered list of restaurants from the backend.
export function useRecommendation() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchData(c: { lat: number; lng: number }, prefs: any) {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/recommend?lat=${c.lat}&lng=${c.lng}&max_travel=${prefs.travelTime}&cuisine=${prefs.categories}&avg_stars=${prefs.stars}`
      );
      if (!res.ok) throw new Error("Failed to fetch");
      setData(await res.json());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Get the user's location, then search with their preferences.
  function search(prefs: any) {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        await fetchData(c, prefs);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
  }

  return { data, loading, error, search };
}
