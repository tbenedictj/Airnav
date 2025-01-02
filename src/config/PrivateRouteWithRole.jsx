import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRouteWithRole = ({ children, allowedRoles }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/loginform" />;
  }

  const userEmail = currentUser.email.toLowerCase();
  const userRole = (() => {
    switch (userEmail) {
      case 'admin@airnav.com':
        return 'admin';
      case 'manager@airnav.com':
        return 'manager';
      case 'cns@airnav.com':
        return 'cns';
      case 'support@airnav.com':
        return 'support';
      case 'supervisor@airnav.com':
        return 'supervisor';
      case 'viewer@airnav.com':
        return 'viewer';
      default:
        return 'viewer';
    }
  })();

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default PrivateRouteWithRole;
