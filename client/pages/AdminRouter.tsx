import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

export default function AdminRouter() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    setIsAuthenticated(token === "admin-swipr-2025");
  }, []);

  const handleLogin = (token: string) => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <AdminLogin onLogin={handleLogin} isAuthenticated={isAuthenticated} />
        }
      />
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            <AdminDashboard />
          ) : (
            <AdminLogin
              onLogin={handleLogin}
              isAuthenticated={isAuthenticated}
            />
          )
        }
      />
    </Routes>
  );
}
