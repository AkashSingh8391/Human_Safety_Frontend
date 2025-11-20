import React, { useEffect, useState } from "react";
import api, { setAuthToken } from "../services/api";
import MapTracker from "../components/MapTracker";

// OPTIONAL (if you want Civil to send location via WebSocket ALSO)
// import { connect, disconnect, publishLocationUpdate } from "../services/socket";

export default function CivilDashboard() {
  const [currentPos, setCurrentPos] = useState(null);
  const [alertId, setAlertId] = useState(null);
  const [positions, setPositions] = useState([]);

  // Load token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuthToken(token);

    // OPTIONAL — connect WebSocket
    // connect(() => console.log("Civil WS Connected"));

    return () => {
      // OPTIONAL — cleanup WS
      // disconnect();
    };
  }, []);

  // Auto-send location every 5 seconds when alertId is created
  useEffect(() => {
    let interval;

    if (alertId) {
      interval = setInterval(() => {
        sendLocation(false); // false = do not create new alert
      }, 5000);
    }

    return () => clearInterval(interval);
  }, [alertId]);

  // Single function to create SOS + update location
  const sendLocation = async (forceCreate = true) => {
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
          // 1) If no alert exists → CREATE alert
          if (!alertId && forceCreate) {
            const res = await api.post("/alert/sos", {
              userId: 1, // you can replace with logged-in user ID
              message: "SOS! Please help",
              latitude: lat,
              longitude: lng,
            });

            setAlertId(res.data.alertId);
          }

          // 2) If alert exists → UPDATE location
          if (alertId) {
            await api.post(`/alert/update/${alertId}`, {
              latitude: lat,
              longitude: lng,
            });

            // OPTIONAL — also publish via WebSocket
            // publishLocationUpdate(alertId, lat, lng);
          }
        } catch (err) {
          console.error("SOS error:", err);
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
        className="sos-btn"
        style={{
          padding: "10px 20px",
          background: "red",
          color: "white",
          border: "none",
          cursor: "pointer",
          borderRadius: "8px",
          fontSize: "16px",
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
