import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ user, role, children }) => {
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/login" />;
  return children;
};
