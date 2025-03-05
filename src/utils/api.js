import axios from 'axios';

// Store JWTs in ls
function getLocalAuth() {
  const auth = localStorage.getItem(process.env.NEXT_PUBLIC_AUTH_LKEY)
  if (!auth) return null
  return JSON.parse(auth)
}

function saveAuth(data) {
  localStorage.setItem(process.env.NEXT_PUBLIC_AUTH_LKEY, JSON.stringify(data))
}

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
    const auth = getLocalAuth();

    if (auth) {
      config.headers['Authorization'] = `Bearer ${auth.token}`;
    } else {
      throw new Error('No AUTH token!: ' + process.env.NEXT_PUBLIC_AUTH_LKEY)
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
        const auth = getLocalAuth();

        // No saved tokens
        if (!auth) {
          console.error('No refresh token found');
          return Promise.reject(error);
        }

        // Use refresh token
        const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + 'auth/refresh', {
          refresh_token: auth.refresh_token,
        });

        const { token, refresh_token } = response.data;

        saveAuth({
          ...getLocalAuth(), 
          token,
          refresh_token
        })

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

function isString(variable) {
  return typeof variable === 'string';
}

function isObject(variable) {
  return typeof variable === 'object' && variable !== null && !Array.isArray(variable);
}

const errorCodes = {
  "INSUFFICIENT_BALANCE": "You have insufficient balance! Please deposit some funds first.",
  "NOTHING_TO_BURN": "Not enough volume yet to request a burn!",
  "WITHDRAWAL_PENDING": "Another withdrawal is pending!",
  "TOKEN_NOT_SUPPORTED": "Token not supported on this network!"
}

export function getApiError(error, defaultMessage = "Something went wrong! Try again.") {
  if (isString(error)) {
    return error
  }

  if (isObject(error)) {
    if (error?.details) {
      if (error.details.includes("params/token_address must match pattern")) return "Invalid token address!"
      return error.details
    }
    
    if (error?.error) {
      if (errorCodes[error?.error]) return errorCodes[error?.error]
      return error?.error
    }

    if (error?.message) return error?.message
  }

  return defaultMessage
}