import ProtectedRoute from "./ProtectedRoute";
import { Outlet } from "react-router-dom";

export default function DoctorRoutes() {
  return (
    <ProtectedRoute allowedRole="doctor">
      <Outlet />
    </ProtectedRoute>
  );
}
