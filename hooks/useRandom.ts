"use client";

import { useState } from "react";
import { getCoords } from "@/lib/geo";

export function useRandomRestaurant() {
  const [randomRestaurant, setRandomRestaurant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function pickRandom(restaurantList, prefs) {
    try {
      // If a list already exists, pick from it with no API call.
      if (restaurantList && restaurantList.length > 0) {
        const restaurant =
          restaurantList[Math.floor(Math.random() * restaurantList.length)];
        setRandomRestaurant(restaurant);
        return restaurant;
      }

      // Otherwise search fresh from the backend.
      setLoading(true);
      const c = await getCoords(); // now awaitable (Promise-wrapped)

      const res = await fetch(
        `http://127.0.0.1:8000/random?lat=${c.lat}&lng=${c.lng}` +
          `&max_travel=${prefs.travelTime || 15}&cuisine=${prefs.categories || ""}&avg_stars=${prefs.stars || 0}`
      );

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      setRandomRestaurant(data);
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { randomRestaurant, loading, error, pickRandom };
}
