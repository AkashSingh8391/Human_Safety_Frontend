import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Dashboard() {
  const navigate = useNavigate();

  async function sendSOS() {
    if (!navigator.geolocation) return alert("Location not supported");

    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        // get userId via /auth/me
        const me = await api.get("/auth/me");
        const alertData = {
          userId: me.data.userId,
          message: "Emergency! I need help!",
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        };

        await api.post("/alert/sos", alertData);

        // open track link (for test) — pass coordinates
        const url = `/track?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`;
        window.open(url, "_blank");

        alert("SOS Sent Successfully!");
      } catch (err) {
        console.error(err);
        alert("Failed to send SOS. Make sure you are logged in and allowed location.");
      }
    }, (err) => { console.error(err); alert("Location error: " + err.message); }, { enableHighAccuracy: true });
  }

  return (
    <div className="container">
      <h1>Dashboard</h1>

      <button onClick={() => navigate("/contacts")}>Manage Emergency Contacts</button>

      <button onClick={sendSOS} style={{ marginTop: "20px", background: "red", color: "white" }}>
        SEND SOS
      </button>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}
        style={{ marginTop: "20px" }}>
        Logout
      </button>
    </div>
  );
}
