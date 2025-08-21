import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';
import { authNotifications } from '../utils/notificationHelper';
import { protectedClient } from '../services/apiClient';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // On mount, check if user is authenticated by calling backend
    useEffect(() => {
        const checkAuth = async () => {
            setLoading(true);
            try {
                const response = await authService.getProfile();
                setUser(response.data);
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (username, password) => {
        try {
            setError(null);
            const response = await authService.login(username, password);
            // After login, fetch user profile
            const profile = await authService.getProfile();
            setUser(profile.data);
            authNotifications.loginSuccess(profile.data.username);
            return profile.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Login failed';
            setError(errorMessage);
            authNotifications.loginError(errorMessage);
            throw err;
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (err) {
            // Ignore API errors on logout
        }
        setUser(null);
        authNotifications.logoutSuccess();
    };

    const refreshToken = async () => {
        try {
            const response = await authService.refreshToken();
            // After refresh, fetch user profile
            const profile = await authService.getProfile();
            setUser(profile.data);
            return profile.data;
        } catch (err) {
            setUser(null);
            throw err;
        }
    };

    const register = async (userData) => {
        try {
            setError(null);
            const response = await authService.register(userData);
            // After successful registration, login the user
            return await login(userData.username, userData.password);
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Registration failed';
            setError(errorMessage);
            throw err;
        }
    };

    const contextValue = {
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        loading,
        error,
        login,
        register,
        logout,
        refreshToken,
        setUser // Expose setUser for profile updates
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};


