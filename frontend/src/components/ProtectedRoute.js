import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import UnauthorizedPage from '../Pages/UnauthorizedPage';

export const ProtectedRoute = ({ children, requireAdmin }) => {
    const { isAuthenticated, isAdmin, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>;
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

    return children;
};
