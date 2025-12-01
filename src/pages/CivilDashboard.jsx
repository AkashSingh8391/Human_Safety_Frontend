import React, { useEffect, useState } from "react";
import api from "../services/api";
import MapTracker from "../components/MapTracker";
import { connectWS } from "../services/ws";

export default function CivilDashboard(){
  const [positions, setPositions] = useState([]);
  const [alertId, setAlertId] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(()=> {
    connectWS(); // realtime connection
    // fetch current user id by username
    (async ()=> {
      try {
        const res = await api.get("/auth/me");
        setUserId(res.data.userId);

      } catch(e) { console.error(e); }
    })();
  },[]);

  // auto update every 5s once alert created
  useEffect(()=> {
    let iv;
    if (alertId) iv = setInterval(()=> sendLocation(false), 5000);
    return ()=> clearInterval(iv);
  }, [alertId]);

  const sendLocation = async (create=true) => {
    if (!navigator.geolocation) { alert("Geolocation not supported"); return; }
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      setPositions(prev => [...prev, [lat,lng]]);
      try {
        if (!alertId && create) {
          const res = await api.post("/alert/sos", {
            userId,
            message: "SOS! I need help",
            latitude: lat, longitude: lng
          });
          setAlertId(res.data.alertId || res.data.id);
        } else if (alertId) {
          await api.post(`/alert/update/${alertId}`, { latitude: lat, longitude: lng });
        }
      } catch (err) { console.error(err); }
    }, (err)=> console.error(err), { enableHighAccuracy: true });
  };

  return (
    <div style={{padding:20}}>
      <h2>Civil Dashboard</h2>
      <button onClick={()=>sendLocation(true)} style={{padding:12, background:"red", color:"white"}}>🚨 Send SOS Now</button>
      <p><b>Alert ID:</b> {alertId || "No active alert"}</p>
      <MapTracker positions={positions} />
    </div>
  );
}
