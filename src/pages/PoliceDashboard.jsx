import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { Map } from "../components/Map";

export const PoliceDashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [locations, setLocations] = useState([]);

  const fetchAlerts = async () => {
    const res = await API.get("/api/alert/police");
    setAlerts(res.data);
    const locs = res.data.map((a) => ({ latitude: a.latitude, longitude: a.longitude }));
    setLocations(locs);
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  const resolveAlert = async (id) => {
    await API.put(`/api/alert/resolve/${id}`);
    fetchAlerts();
  };

  return (
    <div>
      <h2>Police Dashboard</h2>
      <ul>
        {alerts.map((a) => (
          <li key={a.alertId}>
            {a.message} - <button onClick={() => resolveAlert(a.alertId)}>Resolve</button>
          </li>
        ))}
      </ul>
      <Map locations={locations} />
    </div>
  );
};
