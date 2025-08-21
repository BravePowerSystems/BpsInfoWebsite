import axios from 'axios';

// Determine the correct API URL based on environment
const getApiUrl = () => {
  // Check if we're in production (on render.com)
  if (window.location.hostname === 'bps-info-website.vercel.app') {
    return 'https://bps-backend-8lir.onrender.com/api';
  }
  
  // Check if we're in development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:7001/api';
  }
  
  // Fallback to environment variable or default
  return process.env.REACT_APP_API_URL || 'http://localhost:7001/api';
};

const baseURL = getApiUrl();

// Public client for unauthenticated requests
export const publicClient = axios.create({
    baseURL,
    withCredentials: true,
    timeout: 10000
});

// Protected client for authenticated requests
export const protectedClient = axios.create({
    baseURL,
    withCredentials: true,
    timeout: 10000
});

// Add request interceptor to include auth token
protectedClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for better error handling
protectedClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid, clear local storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Redirect to login or refresh token
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Add response interceptor for public client as well
publicClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

console.log('API Client initialized with baseURL:', baseURL);


