import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function LoginPage() {
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");
  const [phoneNo,setPhoneNo]=useState("");
  const [email,setEmail]=useState("");
  const navigate = useNavigate();

  const register = async () => {
    try {
      await api.post("/auth/register", { username, password, phoneNo, email });
      alert("Registered. Now login.");
    } catch (e) { alert(e.response?.data || e.message); }
  };

  const login = async () => {
    try {
      const res = await api.post("/auth/login", { username, password });
      const token = res.data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("phoneNo", phoneNo);
      localStorage.setItem("email", email);
      navigate("/civil");
    } catch (e) { alert(e.response?.data || e.message); }
  };

  return (
    <div style={{ padding: 20, maxWidth: 420, margin: "auto" }}>
      <h2>Register / Login</h2>
      <input placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} />
      <input placeholder="password" value={password} type="password" onChange={e=>setPassword(e.target.value)} />
      <input placeholder="phone (for SMS/demo)" value={phoneNo} onChange={e=>setPhoneNo(e.target.value)} />
      <input placeholder="email (for SOS email)" value={email} onChange={e=>setEmail(e.target.value)} />
      <div style={{marginTop:10}}>
        <button onClick={register}>Register</button>
        <button onClick={login} style={{marginLeft:10}}>Login</button>
      </div>
    </div>
  );
}
