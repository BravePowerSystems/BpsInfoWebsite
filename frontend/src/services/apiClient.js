import axios from 'axios';

// Public client for unauthenticated requests
export const publicClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:7001/api',
    withCredentials: true
});

// Protected client for authenticated requests
export const protectedClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:7001/api',
    withCredentials: true
});


