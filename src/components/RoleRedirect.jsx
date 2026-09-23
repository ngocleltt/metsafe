import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleRedirect = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="protected-loading">
        Loading application...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!profile?.role) {
    return (
      <div className="protected-error">
        Your account profile is not available.
      </div>
    );
  }

  if (profile.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  if (profile.role === 'employee') {
    return <Navigate to="/employee" replace />;
  }

  if (profile.role === 'candidate') {
    return <Navigate to="/candidate" replace />;
  }

  return <Navigate to="/" replace />;
};

export default RoleRedirect;