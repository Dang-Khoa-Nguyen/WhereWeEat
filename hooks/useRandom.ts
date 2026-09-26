"use client";

import { useState } from "react";

export function useRandomRestaurant() {
  const [randomRestaurant, setRandomRestaurant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function pickRandom(restaurantList) {
    try {
      setLoading(true);

      const res = await fetch("http://127.0.0.1:8000/random", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            restaurants: restaurantList 
        }),
      });

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      setRandomRestaurant(data);
      return data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return { randomRestaurant, loading, error, pickRandom };
}
