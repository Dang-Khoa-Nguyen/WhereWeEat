"use client";

import { useEffect, useState } from "react";

export function useRecommendation() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


    async function fetchData() {
      try {
        const res = await fetch("http://127.0.0.1:8000/recommend");

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

  // Fetch on first load
  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetchData: fetchData };
}
