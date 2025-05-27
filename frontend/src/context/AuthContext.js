import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { authNotifications } from '../utils/notificationHelper';

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "https://bpsinfowebsite-production.up.railway.app/"; // Consistent port

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialize auth state from storage
    useEffect(() => {
        const initializeAuth = () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const userData = JSON.parse(localStorage.getItem('user'));
                
                if (accessToken && userData) {
                    setUser(userData);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                }
            } catch (err) {
                console.error('Error initializing auth:', err);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = async (username, password) => {
        try {
            setError(null);
            const response = await axios.post('/api/auth/login', 
                { username, password },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            
            const { accessToken, refreshToken, user: userData } = response.data;
            
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(userData));
            
            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            
            setUser(userData);
            authNotifications.loginSuccess(userData.username);
            return userData;
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Login failed';
            setError(errorMessage);
            authNotifications.loginError(errorMessage);
            throw err;
        }
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        authNotifications.logoutSuccess();
    };

    const refreshToken = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) throw new Error('No refresh token');

            const response = await axios.post('/api/auth/refresh-token', 
                { refreshToken },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

            localStorage.setItem('accessToken', newAccessToken);
            localStorage.setItem('refreshToken', newRefreshToken);
            axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

            return newAccessToken;
        } catch (err) {
            logout();
            throw err;
        }
    };

    // Axios interceptor for token refresh and session handling
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    try {
                        await refreshToken();
                        return axios(originalRequest);
                    } catch (refreshError) {
                        authNotifications.sessionExpired();
                        logout();
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => axios.interceptors.response.eject(interceptor);
    }, []);

    const contextValue = {
        user,
        loading,
        error,
        login,
        logout,
        refreshToken,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
    };

    return (
        <AuthContext.Provider value={contextValue}> 
            {!loading && children}
        </AuthContext.Provider>                        // AuthContext.Provider is a component that provides the context value to its children.
    );
};

// Custom hook for using auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};


/*

Workflow of this file: 
1. The AuthProvider component is created using the createContext hook. This creates a context object that can be used to share data with components.

2. The AuthProvider component uses the useState hook to manage the user state, loading state, and error state.

3. The AuthProvider component uses the useEffect hook to initialize the auth state from storage. This is done by checking if there is an access token and user data in local storage. If there is, the user state is set to the user data and the access token is set as the default header for axios requests.

4. The AuthProvider component exports a login function that sends a POST request to the /api/auth/login endpoint with the username and password. If the request is successful, the access token, refresh token, and user data are stored in local storage and the user state is set to the user data.

5. The AuthProvider component exports a logout function that removes the access token, refresh token, and user data from local storage and sets the user state to null.

6. The AuthProvider component exports a refreshToken function that sends a POST request to the /api/auth/refresh-token endpoint with the refresh token. If the request is successful, the access token and refresh token are updated in local storage and the user state is set to the user data.

7. The AuthProvider component exports an isAuthenticated function that returns true if the user state is not null.

8. The AuthProvider component exports an isAdmin function that returns true if the user state is not null and the user's role is 'admin'.

9. The AuthProvider component exports a contextValue object that contains the user state, loading state, error state, login function, logout function, refreshToken function, isAuthenticated function, and isAdmin function.


10. The AuthProvider component exports a useAuth hook that returns the contextValue object.



*/

