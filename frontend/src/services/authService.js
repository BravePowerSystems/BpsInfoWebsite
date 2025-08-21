import { publicClientMethods, privateClientMethods } from './apiClient';

export const authService = {
    // Public routes
    login: (username, password) => {
        return publicClientMethods.post('/auth/login', { username, password });
    },
    
    register: (userData) => {
        return publicClientMethods.post('/auth/register', userData);
    },
    
    refreshToken: (refreshToken) => {
        return publicClientMethods.post('/auth/refresh-token', { refreshToken });
    },
    
    // Protected routes
    logout: () => {
        return publicClientMethods.post('/auth/logout');
    },
    
    getProfile: () => {
        return privateClientMethods.get('/user/profile');
    },
    
    updateProfile: (userData) => {
        return privateClientMethods.put('/user/profile', userData);
    }
};
