import { create } from "zustand";
import { API_URL } from "@/lib/api";
import { getCoords, geocodeAddress } from "@/lib/geo";
import { Restaurant, Routes, TransportMode } from "@/lib/types";

type Coords = { lat: number; lng: number };

// Caches live OUTSIDE the store — they persist and don't need reactivity.
let locationCache: Coords | null = null;
let routesCache: Record<string, Routes> = {};

const LOCATION_FAIL =
  "We couldn't get your location. Allow location access in your browser, or enter an address below.";

type Store = {
  // --- Preferences ---
  travelTime: number | "";
  cuisine: string;
  stars: number;

  // --- Data ---
  results: Restaurant[];
  selected: Restaurant | null;
  routes: Routes | null;
  mode: TransportMode;
  userLocation: Coords | null;

  // --- UI state ---
  showResults: boolean;
  showMainMap: boolean;
  isRevealOpen: boolean;
  picking: boolean;
  revealed: boolean;
  loadingList: boolean;
  loadingRoutes: boolean;
  error: string | null;
  locationError: string | null;

  // --- Setters (called by components) ---
  setTravelTime: (v: number | "") => void;
  setCuisine: (v: string) => void;
  setStars: (v: number) => void;
  setMode: (m: TransportMode) => void;
  setRevealed: (v: boolean) => void;

  // --- Actions ---
  findRestaurants: () => Promise<void>;
  pickRandom: () => Promise<void>;
  selectRestaurant: (r: Restaurant) => Promise<void>;
  removeRestaurant: (id: string) => void;
  closeReveal: () => void;
  setManualLocation: (address: string) => Promise<boolean>;
};

export const useStore = create<Store>((set, get) => {
  // Internal helper — closes over `set`. Gets location once, then reuses the cache.
  async function getLocation(): Promise<Coords> {
    if (locationCache) return locationCache;
    const c = await getCoords();
    locationCache = c;
    set({ userLocation: c });
    return c;
  }

  // Build the shared query string from current preferences.
  function prefsQuery(c: Coords) {
    const { travelTime, cuisine, stars } = get();
    const travel = travelTime || 15;
    return `lat=${c.lat}&lng=${c.lng}&max_travel=${travel}&cuisine=${cuisine}&avg_stars=${stars}`;
  }

  return {
    // --- initial state ---
    travelTime: "",
    cuisine: "",
    stars: 1,

    results: [],
    selected: null,
    routes: null,
    mode: "walking",
    userLocation: locationCache,

    showResults: false,
    showMainMap: true,
    isRevealOpen: false,
    picking: false,
    revealed: false,
    loadingList: false,
    loadingRoutes: false,
    error: null,
    locationError: null,

    // --- setters ---
    setTravelTime: (v) => set({ travelTime: v }),
    setCuisine: (v) => set({ cuisine: v }),
    setStars: (v) => set({ stars: v }),
    setMode: (m) => set({ mode: m }),
    setRevealed: (v) => set({ revealed: v }),

    // --- actions ---
    findRestaurants: async () => {
      set({ error: null, locationError: null });

      // Location first — if it fails, show the address fallback.
      let c: Coords;
      try {
        c = await getLocation();
      } catch {
        set({ locationError: LOCATION_FAIL });
        return;
      }

      set({ showResults: true, loadingList: true });
      try {
        const res = await fetch(`${API_URL}/recommend?${prefsQuery(c)}`);
        if (!res.ok) throw new Error("Failed to fetch restaurants");
        set({ results: await res.json() });
      } catch (err: any) {
        set({ error: err.message });
      } finally {
        set({ loadingList: false });
      }
    },

    selectRestaurant: async (r) => {
      set({ selected: r });

      // Use cached routes if we already fetched them for this restaurant.
      const cached = routesCache[r.id];
      if (cached) {
        set({ routes: cached });
        return;
      }

      set({ loadingRoutes: true });
      try {
        const c = await getLocation();
        const res = await fetch(
          `${API_URL}/route?from_lat=${c.lat}&from_lng=${c.lng}&to_lat=${r.lat}&to_lng=${r.lng}`
        );
        if (!res.ok) throw new Error("Failed to fetch route");
        const data: Routes = await res.json();
        routesCache[r.id] = data;
        set({ routes: data });
      } catch (err: any) {
        set({ error: err.message });
      } finally {
        set({ loadingRoutes: false });
      }
    },

    pickRandom: async () => {
      set({ error: null, locationError: null });

      const { results, selectRestaurant } = get();

      // Decide how to get the restaurant. If no list yet, we need location
      // first — handle that failure BEFORE opening the wheel.
      let getRestaurant: () => Promise<Restaurant>;

      if (results.length > 0) {
        const r = results[Math.floor(Math.random() * results.length)];
        getRestaurant = async () => r;
      } else {
        let c: Coords;
        try {
          c = await getLocation();
        } catch {
          set({ locationError: LOCATION_FAIL });
          return;
        }
        getRestaurant = async () => {
          const res = await fetch(`${API_URL}/random?${prefsQuery(c)}`);
          if (!res.ok) throw new Error("No restaurant found");
          return await res.json();
        };
      }

      // Open the wheel and spin while we load.
      set({ revealed: false, showMainMap: false, picking: true, isRevealOpen: true });

      // Keep the wheel spinning for at least this long so it feels intentional.
      const minSpin = new Promise((resolve) => setTimeout(resolve, 1800));

      try {
        const load = async () => {
          const restaurant = await getRestaurant();
          await selectRestaurant(restaurant); // also fetches/caches the route
        };
        await Promise.all([load(), minSpin]);
        set({ picking: false });
      } catch (err: any) {
        set({ error: err.message, picking: false, isRevealOpen: false });
      }
    },

    removeRestaurant: (id) =>
      set((state) => ({ results: state.results.filter((r) => r.id !== id) })),

    closeReveal: () => set({ isRevealOpen: false, revealed: false, showMainMap: true }),

    setManualLocation: async (address) => {
      try {
        const c = await geocodeAddress(address);
        locationCache = c;
        set({ userLocation: c, locationError: null });
        return true;
      } catch (err: any) {
        set({
          locationError:
            err.message === "Address not found"
              ? "We couldn't find that address — try being more specific."
              : "Something went wrong looking up that address.",
        });
        return false;
      }
    },
  };
});
