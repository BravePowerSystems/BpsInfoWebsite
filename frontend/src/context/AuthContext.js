import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';
import { authNotifications } from '../utils/notificationHelper';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // On mount, check if user is authenticated by checking localStorage and validating token
    useEffect(() => {
        const checkAuth = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('accessToken');
                if (token) {
                    const response = await authService.getProfile();
                    setUser(response.data);
                } else {
                    setUser(null);
                }
            } catch (err) {
                // Token is invalid or expired, clear it
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (username, password, showNotification = true) => {
        try {
            setError(null);
            const response = await authService.login(username, password);
            
            // Store tokens in localStorage
            const { accessToken, refreshToken, user: userData } = response.data;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            
            setUser(userData);
            
            // Only show login success notification if explicitly requested
            if (showNotification) {
                authNotifications.loginSuccess(userData.username);
            }
            
            return userData;
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
        
        // Clear tokens from localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
        authNotifications.logoutSuccess();
    };

    const refreshToken = async () => {
        try {
            const storedRefreshToken = localStorage.getItem('refreshToken');
            if (!storedRefreshToken) {
                throw new Error('No refresh token available');
            }
            
            const response = await authService.refreshToken(storedRefreshToken);
            const { accessToken, refreshToken: newRefreshToken } = response.data;
            
            // Update tokens in localStorage
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', newRefreshToken);
            
            // Fetch updated user profile
            const profile = await authService.getProfile();
            setUser(profile.data);
            return profile.data;
        } catch (err) {
            // Refresh failed, clear tokens and user
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setUser(null);
            throw err;
        }
    };

    const register = async (userData) => {
        try {
            setError(null);
            const response = await authService.register(userData);
            
            // Show registration success notification
            authNotifications.registerSuccess(userData.username);
            
            // After successful registration, automatically log in the user
            // This provides a seamless experience - user doesn't need to login again
            // Pass false to prevent showing the "Welcome Back!" notification
            return await login(userData.username, userData.password, false);
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


