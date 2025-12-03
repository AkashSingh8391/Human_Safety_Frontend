import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Contacts from "./components/Contacts";
import TrackPage from "./components/TrackPage";

export default function App() {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Dashboard /> : <Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/contacts" element={isLoggedIn ? <Contacts /> : <Navigate to="/login" />} />

        {/* Tracking Page for SOS */}
        <Route path="/track" element={<TrackPage />} />
      </Routes>
    </BrowserRouter>
  );
}
