import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon paths
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function TrackPage() {
  const params = new URLSearchParams(window.location.search);
  const sosLat = parseFloat(params.get("lat"));
  const sosLng = parseFloat(params.get("lng"));

  const [myPos, setMyPos] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMyPos([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => console.log("GPS Error:", err),
      { enableHighAccuracy: true }
    );
  }, []);

  const center = myPos || [sosLat, sosLng];

  return (
    <div style={{ height: "100vh" }}>
      <MapContainer center={center} zoom={14} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* SOS sender location */}
        <Marker position={[sosLat, sosLng]}>
          <Popup><strong>SOS Location</strong></Popup>
        </Marker>

        {/* Viewer mobile location */}
        {myPos && (
          <Marker position={myPos}>
            <Popup><strong>Your Current Location</strong></Popup>
          </Marker>
        )}

        {/* Draw a line only if viewer location is available */}
        {myPos && (
          <Polyline positions={[
            [sosLat, sosLng],
            myPos
          ]} />
        )}
      </MapContainer>
    </div>
  );
}
