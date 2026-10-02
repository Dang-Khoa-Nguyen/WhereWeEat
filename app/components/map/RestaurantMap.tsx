"use client";

import dynamic from "next/dynamic";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);

import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { Restaurant, LatLng } from "@/lib/types";
import { useStore } from "@/store/useStore";

type RestaurantMapProps = {
  route: LatLng[] | null;
  destination: Restaurant | null;
};

const ADELAIDE: LatLng = [-34.9287, 138.5986];

export default function RestaurantMap({route, destination}: RestaurantMapProps) {
  const userLocation = useStore((s) => s.userLocation); // shared location, fetched once
  const [icon, setIcon] = useState<any>(null);

  // Use the place's own Foursquare icon if we have one, else a fallback
  const iconUrl = destination?.icon?.prefix
  ? `${destination.icon.prefix}64${destination.icon.suffix}`
  : "/assets/restaurant.png";

  // Build the marker icon on the client (Leaflet needs the browser)
  useEffect(() => {
    import("leaflet").then((mod) => {
      const L = (mod as any).default ?? mod;
      setIcon(
        L.icon({
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        })
      );
    });
  }, []);

  const center: LatLng = userLocation ? [userLocation.lat, userLocation.lng] : ADELAIDE;

  return (
    <MapContainer center={center} zoom={13} style={{ height: "400px", width: "90%", borderRadius: 12, overflow: "hidden" }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {icon && userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={icon} aria-label="Your Location"> 
        <Popup>
            <img alt="your location" src="/assets/logo-1.png" width={120} />
            <p className="text-white">You are here</p> 
          </Popup>
      </Marker>
      )}
      
      {route && <Polyline positions={route} />}
      {destination && icon && <Marker position={[destination.lat, destination.lng]} icon={icon} aria-label="Destination">
        <Popup> 
          <div className="bg-[#193948] p-3 rounded-lg text-white flex flex-col items-center">
            <img alt="destination" src={iconUrl} className="h-8 w-8" />
            <p className="text-white"> {destination.name} </p> 
          </div>
          </Popup>
        </Marker>}
    </MapContainer>
  );
}
