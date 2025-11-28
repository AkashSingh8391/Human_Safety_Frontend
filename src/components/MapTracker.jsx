import React from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MapTracker({ positions }) {
  const center = positions.length ? positions[positions.length-1] : [26.2183, 78.1828];
  return (
    <div style={{height:400,width:'100%'}}>
      <MapContainer center={center} zoom={15} style={{height:'100%', width:'100%'}}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {positions.length>0 && <>
          <Marker position={positions[positions.length-1]} />
          <Polyline positions={positions} />
        </>}
      </MapContainer>
    </div>
  );
}
