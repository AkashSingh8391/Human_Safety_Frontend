import React, { useEffect, useState, useRef } from "react";
import api from "../services/api";
import MapTracker from "../components/MapTracker";

export default function CivilDashboard(){
  const [positions, setPositions] = useState([]); // [ [lat,lng], ... ]
  const [alertId, setAlertId] = useState(null);
  const pollingRef = useRef(null);

  useEffect(()=> {
    return ()=> {
      if (pollingRef.current) clearInterval(pollingRef.current);
    }
  },[]);

  const sendSosOnce = () => {
    if (!navigator.geolocation) { alert("Geolocation not supported"); return; }
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      setPositions(prev => [...prev, [lat, lng]]);
      try {
        const userId = null; // optional: if you saved userId after login
        const res = await api.post("/alert/sos", {
          userId: userId,
          message: "I am in trouble. Please help!",
          latitude: lat,
          longitude: lng
        });
        const id = res.data.alertId || res.data.id;
        setAlertId(id);

        pollingRef.current = setInterval(() => updateLocation(id), 5000);
      } catch (e) {
        console.error(e);
        alert("SOS failed");
      }
    }, (err)=> { console.error(err); alert("Location permission required");}, { enableHighAccuracy: true });
  };

  const updateLocation = async (id) => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      setPositions(prev => [...prev, [lat, lng]]);
      try {
        await api.post(`/alert/update/${id}`, { latitude: lat, longitude: lng });
      } catch (e) {
        console.error("update failed:", e);
      }
    }, (err)=> console.error(err), { enableHighAccuracy:true });
  };

  const stopSos = async () => {
    if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null; }
    setAlertId(null);
  };

  return (
    <div style={{ padding:20 }}>
      <h2>Civil Dashboard - SOS</h2>
      <button onClick={sendSosOnce} style={{background:"red", color:"white", padding:10}}>🚨 Send SOS</button>
      <button onClick={stopSos} style={{marginLeft:10}}>Stop</button>
      <p>Alert: {alertId ? alertId : "No active alert"}</p>
      <MapTracker positions={positions} />
    </div>
  );
}
