"use client";

import { createContext, useContext, useRef, useState, ReactNode } from "react";
import { API_URL } from "@/lib/api";
import { getCoords, geocodeAddress } from "@/lib/geo";
import { Restaurant, Routes, TransportMode } from "@/lib/types";

type Coords = { lat: number; lng: number };

type AppContextType = {
  // Preferences
  travelTime: number | "";
  setTravelTime: (v: number | "") => void;
  cuisine: string;
  setCuisine: (v: string) => void;
  stars: number;
  setStars: (v: number) => void;

  // Data
  results: Restaurant[];
  selected: Restaurant | null;
  routes: Routes | null;
  mode: TransportMode;
  setMode: (m: TransportMode) => void;
  userLocation: Coords | null;

  // UI state
  showResults: boolean;
  showMainMap: boolean;
  isRevealOpen: boolean;
  picking: boolean;
  revealed: boolean;
  setRevealed: (v: boolean) => void;
  loadingList: boolean;
  loadingRoutes: boolean;
  error: string | null;
  locationError: string | null;

  // Actions
  findRestaurants: () => Promise<void>;
  pickRandom: () => Promise<void>;
  selectRestaurant: (r: Restaurant) => Promise<void>;
  removeRestaurant: (id: string) => void;
  closeReveal: () => void;
  setManualLocation: (address: string) => Promise<boolean>;
};

const AppContext = createContext<AppContextType | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}

export function AppProvider({ children }: { children: ReactNode }) {
  // Preferences (cuisine starts empty = "any")
  const [travelTime, setTravelTime] = useState<number | "">("");
  const [cuisine, setCuisine] = useState("");
  const [stars, setStars] = useState(1);

  // Data
  const [results, setResults] = useState<Restaurant[]>([]);
  const [selected, setSelected] = useState<Restaurant | null>(null);
  const [routes, setRoutes] = useState<Routes | null>(null);
  const [mode, setMode] = useState<TransportMode>("walking");
  const [userLocation, setUserLocation] = useState<Coords | null>(null);

  // UI state
  const [showResults, setShowResults] = useState(false);
  const [showMainMap, setShowMainMap] = useState(true);
  const [isRevealOpen, setIsRevealOpen] = useState(false);
  const [picking, setPicking] = useState(false); // spinning-wheel phase
  const [revealed, setRevealed] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingRoutes, setLoadingRoutes] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Caches — refs so updating them doesn't cause re-renders.
  const locationRef = useRef<Coords | null>(null);
  const routesCacheRef = useRef<Record<string, Routes>>({});

  // Ask the browser for location once, then reuse it everywhere.
  async function getLocation(): Promise<Coords> {
    if (locationRef.current) return locationRef.current;
    const c = await getCoords();
    locationRef.current = c;
    setUserLocation(c);
    return c;
  }

  const LOCATION_FAIL =
    "We couldn't get your location. Allow location access in your browser, or enter an address below.";

  // Fallback: geocode a typed address and use it as the location.
  async function setManualLocation(address: string): Promise<boolean> {
    try {
      const c = await geocodeAddress(address);
      locationRef.current = c;
      setUserLocation(c);
      setLocationError(null);
      return true;
    } catch (err: any) {
      setLocationError(
        err.message === "Address not found"
          ? "We couldn't find that address — try being more specific."
          : "Something went wrong looking up that address."
      );
      return false;
    }
  }

  function prefsQuery(c: Coords) {
    const travel = travelTime || 15;
    return `lat=${c.lat}&lng=${c.lng}&max_travel=${travel}&cuisine=${cuisine}&avg_stars=${stars}`;
  }

  async function findRestaurants() {
    setError(null);
    setLocationError(null);

    // Location first — if it fails, show the address fallback instead of a generic error.
    let c: Coords;
    try {
      c = await getLocation();
    } catch {
      setLocationError(LOCATION_FAIL);
      return;
    }

    setShowResults(true);
    setLoadingList(true);
    try {
      const res = await fetch(`${API_URL}/recommend?${prefsQuery(c)}`);
      if (!res.ok) throw new Error("Failed to fetch restaurants");
      setResults(await res.json());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingList(false);
    }
  }

  // Fetch (and cache) the routes for one restaurant, then focus it.
  async function selectRestaurant(r: Restaurant) {
    setSelected(r);

    const cached = routesCacheRef.current[r.id];
    if (cached) {
      setRoutes(cached);
      return;
    }

    setLoadingRoutes(true);
    try {
      const c = await getLocation();
      const res = await fetch(
        `${API_URL}/route?from_lat=${c.lat}&from_lng=${c.lng}&to_lat=${r.lat}&to_lng=${r.lng}`
      );
      if (!res.ok) throw new Error("Failed to fetch route");
      const data: Routes = await res.json();
      routesCacheRef.current[r.id] = data;
      setRoutes(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingRoutes(false);
    }
  }

  async function pickRandom() {
    setError(null);
    setLocationError(null);

    // Decide how we'll get the restaurant. If there's no list yet we need
    // location first — handle that failure BEFORE opening the wheel.
    let getRestaurant: () => Promise<Restaurant>;

    if (results.length > 0) {
      // Reuse the already-loaded list (no extra API call, no location needed).
      const r = results[Math.floor(Math.random() * results.length)];
      getRestaurant = async () => r;
    } else {
      let c: Coords;
      try {
        c = await getLocation();
      } catch {
        setLocationError(LOCATION_FAIL);
        return;
      }
      getRestaurant = async () => {
        const res = await fetch(`${API_URL}/random?${prefsQuery(c)}`);
        if (!res.ok) throw new Error("No restaurant found");
        return await res.json();
      };
    }

    // Now open the wheel and spin while we load.
    setRevealed(false);
    setShowMainMap(false);
    setPicking(true);
    setIsRevealOpen(true);

    // Keep the wheel spinning for at least this long so it always feels intentional.
    const minSpin = new Promise((resolve) => setTimeout(resolve, 1800));

    try {
      const load = async () => {
        const restaurant = await getRestaurant();
        await selectRestaurant(restaurant); // also fetches/caches the route
      };
      await Promise.all([load(), minSpin]);
      setPicking(false); // wheel stops → scratch card appears
    } catch (err: any) {
      setError(err.message);
      setPicking(false);
      setIsRevealOpen(false);
    }
  }

  function removeRestaurant(id: string) {
    setResults((prev) => prev.filter((r) => r.id !== id));
  }

  function closeReveal() {
    setIsRevealOpen(false);
    setRevealed(false);
    setShowMainMap(true);
  }

  const value: AppContextType = {
    travelTime, setTravelTime, cuisine, setCuisine, stars, setStars,
    results, selected, routes, mode, setMode, userLocation,
    showResults, showMainMap, isRevealOpen, picking, revealed, setRevealed,
    loadingList, loadingRoutes, error, locationError,
    findRestaurants, pickRandom, selectRestaurant, removeRestaurant, closeReveal,
    setManualLocation,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
