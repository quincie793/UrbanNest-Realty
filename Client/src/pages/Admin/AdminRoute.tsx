import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute() {
  // Get user from localStorage
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  // Check if user exists and role is admin (case-insensitive)
  if (!user || user.role.toLowerCase() !== "admin") {
    alert("Access denied. Admins only! ❌");
    return <Navigate to="/login" replace />;
  }

  // If admin, render child routes
  return <Outlet />;
}