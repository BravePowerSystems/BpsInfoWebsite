import axios from 'axios';

const API_BASE_URL = 'http://localhost:7001/api';

// Public API client (no auth required)
export const publicClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Protected API client (auth required)
export const protectedClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth interceptor only to protected client
protectedClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


// this file contains the code for creating the api client. api client is used to make api requests to the backend. 
