"use client";

import { useEffect, useState } from "react";

export function useRecommendation() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchData(c,prefs) {

      setLoading(true);
      
      try {
        const res = await fetch(`http://127.0.0.1:8000/recommend?lat=${c.lat}&lng=${c.lng}&max_travel=${prefs.travelTime}&cuisine=${prefs.categories}&avg_stars=${prefs.stars}`);

        if (!res.ok) {
          throw new Error("Failed to fetch");
        }

        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

  // refetch function
  function search(prefs) {
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
      setError(err.message)
      setLoading(false);
    }
    );
  }

  return { data, loading, error, search};
}
