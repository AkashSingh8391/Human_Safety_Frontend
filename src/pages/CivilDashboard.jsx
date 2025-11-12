import React, { useState, useEffect, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { Map } from "../components/Map";
import { toast } from "react-toastify";

export const CivilDashboard = () => {
  const { user } = useContext(AuthContext);
  const [locations, setLocations] = useState([]);
  const [message, setMessage] = useState("");

  const sendSOS = async () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(async (position) => {
      const alertData = {
        message,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      try {
        await API.post("/api/alert/sos", alertData, { headers: { username: user.username } });
        toast.success("SOS Alert Sent!");
        setMessage("");
        setLocations((prev) => [...prev, alertData]);
      } catch (err) {
        toast.error("Failed to send SOS");
      }
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocations((prev) => [...prev, { latitude: pos.coords.latitude, longitude: pos.coords.longitude }]);
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Civil Dashboard</h2>
      <input placeholder="Enter SOS Message" value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendSOS}>Send SOS</button>
      <Map locations={locations} />
    </div>
  );
};
