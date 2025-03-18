import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Marketing from "./components/Marketing";
import Auth from "./components/Auth";
import UserHome from "./components/UserHome";
import MainLayout from "./components/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          {/* Public routes (accessible to everyone) */}
          <Route index element={<Marketing />} />

          {/* Routes only for non-authenticated users */}
          <Route element={<PublicOnlyRoute />}>
            <Route path="/auth/:mode" element={<Auth />} />
          </Route>

          {/* Protected routes (require authentication) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/user" element={<UserHome />} />
          </Route>

          <Route path="*" element={<p>not found</p>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
