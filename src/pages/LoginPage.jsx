import React, { useState } from "react";
import api from "../services/api";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function LoginPage(){
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");
  const [emergencyEmail,setEmergencyEmail]=useState("");
  const [emergencyPhone,setEmergencyPhone]=useState("");
  const navigate = useNavigate();

  const register = async () => {
    try {
      await api.post("/auth/register", { username, password, emergencyEmail, emergencyPhone });
      alert("Registered. Now login.");
    } catch (e) { alert(e.response?.data || e.message); }
  };

  const login = async () => {
    try {
      const res = await api.post("/auth/login", { username, password });
      const token = res.data.token;
      localStorage.setItem("token", token);
      const user = jwtDecode(token);
      // we store username for later (we will fetch userId via backend if needed)
      localStorage.setItem("username", username);
      navigate("/civil");
    } catch (e) { alert(e.response?.data || e.message); }
  };

  return (
    <div style={{padding:20}}>
      <h2>Register / Login</h2>
      <input placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} /><br/>
      <input placeholder="password" value={password} type="password" onChange={e=>setPassword(e.target.value)} /><br/>
      <input placeholder="emergency phone (with country code +91...)" value={emergencyPhone} onChange={e=>setEmergencyPhone(e.target.value)} /><br/>
      <input placeholder="emergency email" value={emergencyEmail} onChange={e=>setEmergencyEmail(e.target.value)} /><br/>
      <button onClick={register}>Register</button>
      <button onClick={login}>Login</button>
    </div>
  );
}
