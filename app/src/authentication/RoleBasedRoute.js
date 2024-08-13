import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const RoleBasedRoute = ({ allowedRoles, children }) => {
    const { isAuthenticated, user } = useAuth(); 
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/" state={{ from: location }} />;
    }

    if (user && !allowedRoles.includes(user.roleType)) {
        return <Navigate to="/unauthorized" state={{ from: location }} />;
    }

    return children;
};

export default RoleBasedRoute;
