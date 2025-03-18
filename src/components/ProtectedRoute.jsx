import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { usePocket } from "../contexts/PocketContext";

function ProtectedRoute() {
  const { user } = usePocket();

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
