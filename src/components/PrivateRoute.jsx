import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

const PrivateRoute = ({ children, requiredRole }) => {
    const isAuthenticated = authService.isAuthenticated();
    const hasRequiredRole = requiredRole ? authService.hasRole(requiredRole) : true;

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (requiredRole && !hasRequiredRole) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

export default PrivateRoute;
