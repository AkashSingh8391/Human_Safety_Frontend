import React, { useEffect, useState } from "react";
import api, { setAuthToken } from "../services/api";
import MapTracker from "../components/MapTracker";

export default function CivilDashboard() {
  const [currentPos, setCurrentPos] = useState(null);
  const [alertId, setAlertId] = useState(null);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuthToken(token);
  }, []);

  // get browser location once and every 5 seconds push to server (if alert active)
  useEffect(() => {
    let interval;
    if (alertId) {
      interval = setInterval(sendLocation, 5000);
    }
    return ()=>clearInterval(interval);
  }, [alertId]);

  const sendLocation = () => {
    if (!navigator.geolocation) { alert("Geolocation not supported"); return; }
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      setCurrentPos({ lat, lng });
      setPositions(prev => [...prev, [lat, lng]]);
      try {
        if (!alertId) {
          // create alert
          const res = await api.post("/alert/sos", {
            userId: 0, // backend can map user by token; simplified here
            message: "SOS! Please help",
            latitude: lat,
            longitude: lng
          });
          setAlertId(res.data.alertId);
          // store alert id for updates
        } else {
          // update existing alert location (simulate progression)
          await api.post(`/alert/update/${alertId}`, { latitude: lat, longitude: lng });
        }
      } catch (err) {
        console.error(err);
      }
    }, (err) => console.error(err), { enableHighAccuracy: true });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Civil Dashboard</h2>
      <button onClick={sendLocation} className="sos-btn">🚨 Send SOS Now</button>
      <p>Alert ID: {alertId || "No active alert"}</p>
      <MapTracker positions={positions} />
    </div>
  );
}
