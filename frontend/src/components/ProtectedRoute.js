import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation, Navigate } from 'react-router-dom';
import UnauthorizedPage from '../Pages/UnauthorizedPage';
import Loading from "../Pages/Product";
export const ProtectedRoute = ({ children, requireAdmin, requireUser }) => {
    const { isAuthenticated, isAdmin, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <Loading />
    }

    if (!isAuthenticated) {
        return (
            <UnauthorizedPage 
                type="authentication"
                currentPath={location.pathname}
            />
        );
    }

    if (requireAdmin && !isAdmin) {
        return (
            <UnauthorizedPage 
                type="authorization"
                currentPath={location.pathname}
            />
        );
    }
    
    // New check: if route requires regular user (not admin)
    if (requireUser && isAdmin) {
        return <Navigate to="/admin" />;
    }

    return children;
};
