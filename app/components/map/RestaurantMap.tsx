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

  const iconUrl = destination?.icon?.prefix
  ? `${destination.icon.prefix}64${destination.icon.suffix}`
  : "/assets/restaurant.png";

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

  useEffect( () => {
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
  })
 
  return (
    <MapContainer center={[-34.9287, 138.5986]} zoom={13} style={{ height: "400px", width: "90%", borderRadius: 12, overflow: "hidden" }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {icon && (
        <Marker position={[lat, lng]} icon={icon}>
        <Popup>
            <img src="/assets/logo-1.png" width={120} />
            <p className="text-white">You are here</p> 
          </Popup>
      </Marker>
      )}
      
      {route && <Polyline positions={route} />}
      {destination && icon && <Marker position={[destination.lat, destination.lng]} icon={icon}>
        <Popup> 
          <div className="bg-[#193948] p-3 rounded-lg text-white flex flex-col items-center">
            <img src={iconUrl} className="h-8 w-8" />
            <p className="text-white"> {destination.name} </p> 
          </div>
          </Popup>
        </Marker>}
    </MapContainer>
  );
}
