import React, { useEffect, useState } from "react";
import api, { setAuthToken } from "../services/api";
import MapTracker from "../components/MapTracker";
import { connectWS, sendLocationWS } from "../services/ws";

export default function CivilDashboard() {
  const [currentPos, setCurrentPos] = useState(null);
  const [alertId, setAlertId] = useState(null);
  const [positions, setPositions] = useState([]);

  // Load token and connect WebSocket on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuthToken(token);

    connectWS();  // <-- REAL-TIME WS CONNECTION

  }, []);

  // Auto-send real-time location every 5 seconds after SOS
  useEffect(() => {
    let interval;

    if (alertId) {
      interval = setInterval(() => sendLocation(false), 5000);
    }

    return () => clearInterval(interval);
  }, [alertId]);

  // SEND SOS + UPDATE LOCATION
  const sendLocation = async (firstTime = true) => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setCurrentPos({ lat, lng });
        setPositions((prev) => [...prev, [lat, lng]]);

        try {
          // 1) Create SOS alert first time
          if (!alertId && firstTime) {
            const res = await api.post("/alert/sos", {
              userId: 1,
              message: "SOS! Please help",
              latitude: lat,
              longitude: lng,
            });

            setAlertId(res.data.id || res.data.alertId);
          }

          // 2) Update existing alert location in backend
          if (alertId) {
            await api.post(`/alert/update/${alertId}`, {
              latitude: lat,
              longitude: lng,
            });
          }

          // 3) SEND in REAL-TIME to Police via WebSocket
          sendLocationWS(alertId, lat, lng);

        } catch (err) {
          console.error("Location update failed:", err);
        }
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Civil Dashboard</h2>

      <button
        onClick={() => sendLocation(true)}
        style={{
          padding: "12px 20px",
          background: "red",
          color: "white",
          borderRadius: "8px",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        🚨 Send SOS Now
      </button>

      <p>
        <b>Alert ID:</b> {alertId || "No active alert"}
      </p>

      <MapTracker positions={positions} />
    </div>
  );
}
