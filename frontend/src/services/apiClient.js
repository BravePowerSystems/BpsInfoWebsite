// src/services/apiClient.js
// Reusable API client for making authenticated and unauthenticated requests

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:7001/api';

export const apiClientOptions = {
  method: 'GET',
  headers: {},
  body: undefined,
  token: undefined
};

export async function apiClient(
  url,
  options = {}
) {
  const { method = 'GET', headers = {}, body, token } = options;
  
  // Don't set Content-Type for FormData (let browser set it with boundary)
  const finalHeaders = {
    ...headers,
  };
  
  // Only set Content-Type for JSON requests
  if (body && !(body instanceof FormData)) {
    finalHeaders['Content-Type'] = 'application/json';
  }
  
  // Attach JWT if available
  const authToken = token || (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : undefined);
  if (authToken) {
    finalHeaders['Authorization'] = `Bearer ${authToken}`;
  }
  
  // Prepend base URL if not absolute
  const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;
  
  const res = await fetch(fullUrl, {
    method,
    headers: finalHeaders,
    body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined,
  });
  
  const data = await res.json();
  
  if (!res.ok) {
    // Create Axios-like error structure for consistency
    const error = new Error(data.message || data.error || 'API request failed');
    error.response = {
      data: data,
      status: res.status,
      statusText: res.statusText,
      headers: res.headers
    };
    throw error;
  }
  
  // Return Axios-like response structure for consistency
  return {
    data: data,
    status: res.status,
    statusText: res.statusText,
    headers: res.headers,
    config: { url: fullUrl, method, headers: finalHeaders }
  };
}

// Public client: does not attach token
export async function publicClient(url, options = {}) {
  // Ensure no token is sent
  return apiClient(url, { ...options, token: undefined });
}

// Private client: always attaches token from localStorage (or passed token)
export async function privateClient(url, options = {}) {
  // Use token from localStorage or throw if not present
  const token = (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : undefined);
  if (!token) {
    throw new Error('No authentication token found');
  }
  return apiClient(url, { ...options, token });
}

// Convenience methods for common HTTP operations
export const apiClientMethods = {
  get: (url, options = {}) => apiClient(url, { ...options, method: 'GET' }),
  post: (url, body, options = {}) => apiClient(url, { ...options, method: 'POST', body }),
  put: (url, body, options = {}) => apiClient(url, { ...options, method: 'PUT', body }),
  delete: (url, options = {}) => apiClient(url, { ...options, method: 'DELETE' }),
  patch: (url, body, options = {}) => apiClient(url, { ...options, method: 'PATCH', body })
};

export const publicClientMethods = {
  get: (url, options = {}) => publicClient(url, { ...options, method: 'GET' }),
  post: (url, body, options = {}) => publicClient(url, { ...options, method: 'POST', body }),
  put: (url, body, options = {}) => publicClient(url, { ...options, method: 'PUT', body }),
  delete: (url, options = {}) => publicClient(url, { ...options, method: 'DELETE' }),
  patch: (url, body, options = {}) => publicClient(url, { ...options, method: 'PATCH', body })
};

export const privateClientMethods = {
  get: (url, options = {}) => privateClient(url, { ...options, method: 'GET' }),
  post: (url, body, options = {}) => privateClient(url, { ...options, method: 'POST', body }),
  put: (url, body, options = {}) => privateClient(url, { ...options, method: 'PUT', body }),
  delete: (url, options = {}) => privateClient(url, { ...options, method: 'DELETE' }),
  patch: (url, body, options = {}) => privateClient(url, { ...options, method: 'PATCH', body })
};


