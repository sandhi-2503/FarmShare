import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const ProtectedRoute = ({ children, requiredAccountType }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner fullPage message="Authenticating session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Account Type validation
  if (requiredAccountType) {
    if (user?.accountType !== requiredAccountType) {
      // Redirect to their own dashboard
      if (user?.accountType === 'owner') {
        return <Navigate to="/equipment-owner/home" replace />;
      } else {
        return <Navigate to="/farmer/home" replace />;
      }
    }
  }

  return children;
};
