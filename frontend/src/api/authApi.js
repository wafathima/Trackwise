import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    const errorMessage = error.response?.data?.message || 'Something went wrong. Please try again.';
    return Promise.reject(new Error(errorMessage));
  }
);

// Auth API functions
export const registerRequest = (userData) => 
  api.post('/auth/register', userData).then(res => res.data);

export const loginRequest = (credentials) => 
  api.post('/auth/login', credentials).then(res => res.data);

export const googleAuthRequest = (credential) => 
  api.post('/auth/google', { credential }).then(res => res.data);

export const forgotPasswordRequest = (email) => 
  api.post('/auth/forgot-password', { email }).then(res => res.data);

export const resetPasswordRequest = (token, password) => 
  api.put(`/auth/reset-password/${token}`, { password }).then(res => res.data);

export default api;