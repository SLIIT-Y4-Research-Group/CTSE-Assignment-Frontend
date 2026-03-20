import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import { ensureValidToken } from "../api/client.js";
import Loading from "../components/Loading.jsx";

const ProtectedRoute = ({ children }) => {
  const { booting } = useAuth();

  if (booting) {
    return <Loading label="Checking session..." />;
  }

  if (!ensureValidToken()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
