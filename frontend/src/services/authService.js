import { publicClientMethods, privateClientMethods } from './apiClient';

export const authService = {
    // Public routes
    login: (email, password) => {
        return publicClientMethods.post('/auth/login', { email, password });
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
    },
    
    // Password reset routes
    forgotPassword: (email) => {
        return publicClientMethods.post('/auth/forgot-password', { email });
    },
    
    resetPassword: (token, password) => {
        return publicClientMethods.post('/auth/reset-password', { token, password });
    },
    
    validateResetToken: (token) => {
        return publicClientMethods.get(`/auth/validate-reset-token/${token}`);
    }
};
