import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import UnauthorizedAccess from './UnauthorizedAccess';

export const ProtectedRoute = ({ children, requireAdmin }) => {
    const { isAuthenticated, isAdmin, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>;
    }

    // Case 1: Not authenticated
    if (!isAuthenticated) {
        return (
            <UnauthorizedAccess 
                type="authentication"
                message="Please log in to access this page"
                currentPath={location.pathname}
                showLoginButton={true}
            />
        );
    }

    // Case 2: Authenticated but insufficient permissions (trying to access admin routes)
    if (requireAdmin && !isAdmin) {
        return (
            <UnauthorizedAccess 
                type="authorization"
                message="You don't have permission to access this area"
                showBackButton={true}
                alternativeLinks={[
                    { to: '/dashboard', label: 'Go to Dashboard' },
                    { to: '/', label: 'Return Home' }
                ]}
            />
        );
    }

    return children;
};
