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

import "leaflet/dist/leaflet.css"; 

export default function RestaurantMap() {
  const adelaide = { lat: -34.9287, lng: 138.5986 };

  return (
    <MapContainer center={[-34.9287, 138.5986]} zoom={13} style={{ height: "400px", width: "90%", borderRadius: 12, overflow: "hidden" }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* <Marker position={[10.7769, 106.7009]}>
        <Popup>A restaurant here</Popup>
      </Marker> */}
    </MapContainer>
  );
}
