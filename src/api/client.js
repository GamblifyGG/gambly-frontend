import axios from 'axios';
import { getCurrentChainAuth, saveCurrentChainAuth } from "@/utils/auth"

// Axios api config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth Interceptors
api.interceptors.request.use(
  (config) => {
    const auth = getCurrentChainAuth();

    if (auth) {
      config.headers['Authorization'] = `Bearer ${auth?.token}`;
    } 
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercept errors
api.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const originalRequest = error.config;

    // Expired token error
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Avoid infinite retry loops

      try {
        const auth = getCurrentChainAuth();

        // No saved tokens
        if (!auth) {
          console.error('No refresh token found');
          return Promise.reject(error);
        }

        // Use refresh token
        const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + 'auth/refresh', {
          refresh_token: auth?.refresh_token,
        });

        saveCurrentChainAuth(response.data)

        // Retry
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed
        console.error('Token refresh failed:', refreshError);
        return Promise.reject(refreshError);
      }
    }

    // Other errors
    return Promise.reject(error);
  }
);

export default api;

// Error first
export async function awaiter(request, dataProp = null) {
  try {
    const r = await request;
    return dataProp ? [null, r.data[dataProp]] : [null, r.data]
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      return [error.response.data, null];
    }

    return [error.message || error, null];
  }
}