import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({
  children,
  allowedRoles = []
}) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="protected-loading">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(profile?.role)
  ) {
    return <Navigate to="/app" replace />;
  }

  return children;
};

export default ProtectedRoute;