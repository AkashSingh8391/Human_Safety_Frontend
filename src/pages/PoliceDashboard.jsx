import React, { useEffect, useState } from "react";
import api from "../services/api";
import MapTracker from "../components/MapTracker";

export default function PoliceDashboard(){
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000);
    return ()=>clearInterval(interval);
  }, []);

  useEffect(() => {
    let poll;
    if (selectedAlert) {
      fetchTrack();
      poll = setInterval(fetchTrack, 3000);
    }
    return ()=>clearInterval(poll);
  }, [selectedAlert]);

  const fetchAlerts = async () => {
    try {
      const res = await api.get("/alert/active");
      setAlerts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTrack = async () => {
    try {
      const res = await api.get(`/alert/track/${selectedAlert.alertId}`);
      if (res.data) {
        const lat = res.data.latitude;
        const lng = res.data.longitude;
        setPositions(prev => [...prev, [lat, lng]]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const resolveAlert = async (id) => {
    await api.put(`/alert/resolve/${id}`);
    setSelectedAlert(null);
    setPositions([]);
    fetchAlerts();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Police Dashboard</h2>
      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ width: '30%' }}>
          <h3>Active Alerts</h3>
          {alerts.map(a => (
            <div key={a.alertId} style={{ border: '1px solid #ccc', padding: 8, marginBottom: 8 }}>
              <div><b>ID:</b> {a.alertId}</div>
              <div><b>Msg:</b> {a.message}</div>
              <div><b>Time:</b> {new Date(a.timestamp).toLocaleString()}</div>
              <button onClick={() => { setSelectedAlert(a); setPositions([[a.latitude, a.longitude]]) }}>Track</button>
              <button onClick={() => resolveAlert(a.alertId)}>Resolve</button>
            </div>
          ))}
        </div>

        <div style={{ flex: 1 }}>
          <h3>Tracking Map</h3>
          <MapTracker positions={positions} />
        </div>
      </div>
    </div>
  )
}
