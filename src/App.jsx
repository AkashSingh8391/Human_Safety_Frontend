import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import CivilDashboard from "./pages/CivilDashboard";
import PoliceDashboard from "./pages/PoliceDashboard";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/civil" element={<CivilDashboard />} />
      <Route path="/police" element={<PoliceDashboard />} />
    </Routes>
  );
}

export default App;
