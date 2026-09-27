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

export default function RestaurantMap({route, destination}) {
  const adelaide = { lat: -34.9287, lng: 138.5986 };
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [error, setError] = useState("");
  const [icon, setIcon] = useState(null);

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

  if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude),
        setLng(position.coords.longitude)
      },
        (err) => setError(err.message)
      ) 
  return (
    <MapContainer center={[-34.9287, 138.5986]} zoom={13} style={{ height: "400px", width: "90%", borderRadius: 12, overflow: "hidden" }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]}>
        <Popup> 
          <img src="/assets/logo-1.png" width={120} />
          <p>You are here</p> 
          </Popup>
      </Marker>
      {route && <Polyline positions={route} />}
      {destination && <Marker position={[destination.lat, destination.lng]} />}
    </MapContainer>
  );
}
