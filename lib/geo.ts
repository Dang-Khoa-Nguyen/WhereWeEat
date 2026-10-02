// Promise wrapper around the callback-based Geolocation API,
// so it can be used with async/await.
export function getCoords(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      {
        // prefer GPS-level accuracy
        enableHighAccuracy: true,

        // fail after 10s instead of hanging (iOS can hang) 
        timeout: 10000,           

        // accept a cached fix up to 1 min old
        maximumAge: 60000,        
      }
    );
  });
}

// Turn a typed address into coordinates using Nominatim (OpenStreetMap, free).
// Used as a fallback when the browser can't / won't give us the user's location.
export async function geocodeAddress(
  address: string
): Promise<{ lat: number; lng: number }> {
  const url =
    "https://nominatim.openstreetmap.org/search?format=json&limit=1&q=" +
    encodeURIComponent(address);

  const res = await fetch(url, { headers: { "Accept-Language": "en" } });
  if (!res.ok) throw new Error("Geocoding request failed");

  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Address not found");
  }

  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
}
