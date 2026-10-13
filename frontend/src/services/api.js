import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token to every outgoing request if available
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('farmshare_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for unified error message extraction
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token expired or unauthorized, clean local credentials if necessary
    if (error.response && error.response.status === 401) {
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
        // Optional session expired handling
      }
    }
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred. Please try again.';
    return Promise.reject(new Error(message));
  }
);

export default API;
