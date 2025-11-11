import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, Polyline, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = { width: "100%", height: "500px" };

export const Map = ({ locations }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [path, setPath] = useState([]);

  useEffect(() => {
    const coords = locations.map((loc) => ({ lat: loc.latitude, lng: loc.longitude }));
    setPath(coords);
  }, [locations]);

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={path[0] || { lat: 0, lng: 0 }} zoom={15}>
      {locations.length > 0 && <Marker position={{ lat: locations[locations.length-1].latitude, lng: locations[locations.length-1].longitude }} />}
      <Polyline path={path} options={{ strokeColor: "#FF0000", strokeWeight: 3 }} />
    </GoogleMap>
  );
};
