import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const RoleBasedRoute = ({ allowedRoles, children }) => {
    const { isAuthenticated, user } = useAuth(); 
    const location = useLocation();
  
    const from = location.state?.from?.pathname || '/';

    if (!isAuthenticated) {
        return <Navigate to="/" state={{ from: location }} />;
    }

    if (from === '/slot' && location.pathname === '/mentor') {
        return children;
    }
    if (user && !allowedRoles.includes(user.roleType)) {
     
        return <Navigate to="/unauthorized" state={{ from: location }} />;
    }

    return children;
};

export default RoleBasedRoute;
