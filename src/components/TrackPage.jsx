import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";

// FIX Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
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

  // *** Validate SOS coordinates ***
  const isValid = (val) => typeof val === "number" && !isNaN(val);

  if (!isValid(sosLat) || !isValid(sosLng)) {
    return <h2 style={{ textAlign: "center", marginTop: "50px" }}>
      ❌ Invalid SOS coordinates! <br />
      URL must include ?lat=xx&lng=yy
    </h2>;
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setMyPos([pos.coords.latitude, pos.coords.longitude]),
      (err) => console.log("GPS Error:", err),
      { enableHighAccuracy: true }
    );
  }, []);

  const center = myPos || [sosLat, sosLng];

  return (
    <div style={{ height: "100vh" }}>
      <MapContainer center={center} zoom={14} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* SOS sender marker */}
        <Marker position={[sosLat, sosLng]}>
          <Popup><b>SOS Location</b></Popup>
        </Marker>

        {/* Viewer live location */}
        {myPos && (
          <Marker position={myPos}>
            <Popup><b>Your Live Location</b></Popup>
          </Marker>
        )}

        {/* Path between SOS and viewer */}
        {myPos && (
          <Polyline positions={[[sosLat, sosLng], myPos]} />
        )}
      </MapContainer>
    </div>
  );
}
