import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Dashboard() {
  const navigate = useNavigate();

  async function sendSOS() {
    if (!navigator.geolocation) return alert("Location not supported");

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const alertData = {
        userId: 1, // Replace with JWT decoded user ID from /auth/me
        message: "Emergency! I need help!",
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude
      };

      const res = await api.post("/alert/sos", alertData);

      alert("SOS Sent Successfully!");
    });
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
