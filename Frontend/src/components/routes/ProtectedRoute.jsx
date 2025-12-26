// ProtectedRoute.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  // Not logged in? redirect → login with redirect param
  if (!user?.id) {
    const redirect = location.pathname + location.search;
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  // Logged in → render component
  return children;
};

export default ProtectedRoute;
