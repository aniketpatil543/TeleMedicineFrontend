
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ allowedRole }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role"); 

  if (!token) return <Navigate to="/login" />;

  if (allowedRole && allowedRole !== userRole) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
