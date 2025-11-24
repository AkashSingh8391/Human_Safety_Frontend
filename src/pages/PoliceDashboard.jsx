import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  connectWS,
  subscribeToAllAlerts,
  subscribeToSingleAlert,
} from "../services/ws";

export default function PoliceDashboard() {
  const [alerts, setAlerts] = useState([]);
  const [trackingAlert, setTrackingAlert] = useState(null);

  useEffect(() => {
    // 1️⃣ Fetch active alerts when page loads
    api
      .get("/alert/active")
      .then((res) => setAlerts(res.data))
      .catch(() => console.log("Failed to load alerts"));

    // 2️⃣ Connect WebSocket
    connectWS(() => {
      console.log("Police WebSocket Connected");

      // 3️⃣ Subscribe to ALL alerts (new SOS or updated locations)
      subscribeToAllAlerts((alert) => {
        console.log("WS: Incoming alert:", alert);

        setAlerts((prev) => {
          const exists = prev.find((a) => a.id === alert.id);
          if (exists) {
            return prev.map((a) => (a.id === alert.id ? alert : a));
          } else {
            return [alert, ...prev];
          }
        });

        // Update live tracking window if police is tracking this alert
        if (trackingAlert && trackingAlert.id === alert.id) {
          setTrackingAlert(alert);
        }
      });
    });
  }, []);

  // 🔍 When police clicks TRACK button
  const startTracking = (alert) => {
    setTrackingAlert(alert);

    // subscribe real-time only for this alert
    subscribeToSingleAlert(alert.id, (updated) => {
      console.log("WS: Alert update:", updated);

      setTrackingAlert(updated);

      // update list as well
      setAlerts((prev) =>
        prev.map((a) => (a.id === updated.id ? updated : a))
      );
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🚓 Police Dashboard</h2>

      <h3>Active SOS Alerts</h3>
      <ul>
        {alerts.map((a) => (
          <li key={a.id} style={{ marginBottom: "10px" }}>
            <b>{a.message}</b> — {a.latitude}, {a.longitude}
            <button
              style={{
                marginLeft: "10px",
                padding: "5px 10px",
                background: "blue",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={() => startTracking(a)}
            >
              Track
            </button>
          </li>
        ))}
      </ul>

      {trackingAlert && (
        <div style={{ marginTop: 30 }}>
          <h3>📍 Live Tracking Alert #{trackingAlert.id}</h3>
          <p>
            <b>Location:</b> {trackingAlert.latitude}, {trackingAlert.longitude}
          </p>

          {/* Here you can render your live updating map */}
          {/* <LiveMap alert={trackingAlert} /> */}
        </div>
      )}
    </div>
  );
}
