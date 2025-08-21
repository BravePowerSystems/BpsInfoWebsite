import { publicClient, protectedClient } from './apiClient';

export const authService = {
    // Public routes
    login: (username, password) => {
        return publicClient.post('/auth/login', { username, password }, { withCredentials: true });
    },
    
    register: (userData) => {
        return publicClient.post('/auth/register', userData, { withCredentials: true });
    },
    
    refreshToken: () => {
        // No parameter, use cookie
        return publicClient.post('/auth/refresh-token', {}, { withCredentials: true });
    },
    
    // Protected routes
    logout: () => {
        return publicClient.post('/auth/logout', {}, { withCredentials: true });
    },
    
    getProfile: () => {
        return protectedClient.get('/user/profile', { withCredentials: true });
    },
    
    updateProfile: (userData) => {
        return protectedClient.put('/user/profile', userData, { withCredentials: true });
    }
};
