import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { usePocket } from "../contexts/PocketContext";

function PublicOnlyRoute() {
  const { user } = usePocket();

  if (user) {
    return <Navigate to="/user" replace />;
  }

  return <Outlet />;
}

export default PublicOnlyRoute;
