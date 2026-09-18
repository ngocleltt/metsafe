import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="protected-loading">
        Checking authentication...
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (!profile || !profile.is_active) {
    return (
      <div className="protected-error">
        Your account is not active or the profile is missing.
      </div>
    );
  }

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(profile.role)
  ) {
    return (
      <Navigate
        to="/"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
};

export default ProtectedRoute;