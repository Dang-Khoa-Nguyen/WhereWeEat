// Shared types used across the app.

export type Restaurant = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  rating: number;
  cuisine: string;
  address?: string;
  icon?: { prefix: string; suffix: string };
};

export type LatLng = [number, number]; // [lat, lng]

export type RouteInfo = {
  duration_min: number;
  distance_km: number;
  geometry: LatLng[]; // [lat, lng] pairs, ready for Leaflet
};

export type Routes = {
  walking: RouteInfo;
  biking: RouteInfo;
  driving: RouteInfo;
};

export type TransportMode = "walking" | "biking" | "driving";
