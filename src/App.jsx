import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import { CivilDashboard } from "./pages/CivilDashboard";
import { PoliceDashboard } from "./pages/PoliceDashboard";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/civil" element={<ProtectedRoute user={user} role="CIVIL"><CivilDashboard /></ProtectedRoute>} />
          <Route path="/police" element={<ProtectedRoute user={user} role="POLICE"><PoliceDashboard /></ProtectedRoute>} />
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
