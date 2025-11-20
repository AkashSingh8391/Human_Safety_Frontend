import React, { useEffect, useState } from "react";
import { connect, subscribeToAlerts, subscribeToAlert, disconnect } from "../services/socket";
import api from "../services/api";

export default function PoliceDashboard() {
  const [alerts, setAlerts] = useState([]);
  const [trackingAlert, setTrackingAlert] = useState(null);

  useEffect(() => {
    // initial fetch of active alerts
    api.get("/alert/active").then(res => setAlerts(res.data)).catch(()=>{});

    // connect websocket
    connect(() => {
      // onConnected: subscribe general topic
      subscribeToAlerts((alert) => {
        // update alerts list: add or update existing
        setAlerts(prev => {
          const found = prev.find(a => a.alertId === alert.alertId);
          if (found) {
            return prev.map(a => a.alertId === alert.alertId ? alert : a);
          } else {
            return [alert, ...prev];
          }
        });
      });
    });

    return () => {
      disconnect();
    };
  }, []);

  // when police clicks Track on an alert:
  const startTracking = (alert) => {
    setTrackingAlert(alert);
    // subscribe to specific alert updates
    subscribeToAlert(alert.alertId, (updated) => {
      setTrackingAlert(updated);
      // also update list
      setAlerts(prev => prev.map(a => a.alertId === updated.alertId ? updated : a));
    });
  };

  return (
    <div>
      <h3>Active Alerts</h3>
      <ul>
        {alerts.map(a => (
          <li key={a.alertId}>
            {a.message} — {a.latitude},{a.longitude}
            <button onClick={() => startTracking(a)}>Track</button>
          </li>
        ))}
      </ul>

      {trackingAlert && (
        <div>
          <h4>Tracking Alert: {trackingAlert.alertId}</h4>
          <p>Location: {trackingAlert.latitude},{trackingAlert.longitude}</p>
          {/* Render map here and update marker by trackingAlert.latitude/longitude */}
        </div>
      )}
    </div>
  );
}
