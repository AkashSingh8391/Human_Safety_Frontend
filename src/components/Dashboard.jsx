import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    api.get("/auth/me").then((res) => setUserId(res.data.userId));
  }, []);

  async function sendSOS() {
    if (!userId) return alert("User not loaded yet!");

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const alertData = {
        userId,
        message: "Emergency! I need help!",
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude
      };

      await api.post("/alert/sos", alertData);
      alert("SOS Sent Successfully!");
    });
  }

  return (
    <div className="container">
      <h1>Dashboard</h1>

      <button onClick={() => navigate("/contacts")}>Manage Contacts</button>

      <button
        onClick={sendSOS}
        style={{ marginTop: "20px", background: "red", color: "white" }}
      >
        SEND SOS
      </button>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}
      >
        Logout
      </button>
    </div>
  );
}
