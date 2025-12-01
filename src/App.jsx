import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import CivilDashboard from "./pages/CivilDashboard";
import TrackPage from "./components/TrackPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/civil" element={<CivilDashboard />} />
      <Route path="/track" element={<TrackPage />} />   {/* ADDED */}
    </Routes>
  );
}

export default App;
