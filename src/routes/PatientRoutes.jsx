import ProtectedRoute from "./ProtectedRoute";
import { Outlet } from "react-router-dom";

export default function PatientRoutes() {
  return (
    <ProtectedRoute allowedRole="patient">
      <Outlet />
    </ProtectedRoute>
  );
}