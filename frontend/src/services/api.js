import axios from 'axios';

// Get API URL from environment variable or use default
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('adminToken');
    
    // Add token to Authorization header if it exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token is invalid or expired, remove it
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminEmail');
    }
    return Promise.reject(error);
  }
);

/**
 * Register a new labour
 * @param {FormData} formData - Form data containing labour details and photo
 * @returns {Promise} API response
 */
export const registerLabour = async (formData) => {
  try {
    const response = await api.post('/labour/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to register labour' };
  }
};

/**
 * Get labour details by ID
 * @param {string} labourId - Labour ID
 * @returns {Promise} API response
 */
export const getLabourById = async (labourId) => {
  try {
    const response = await api.get(`/labour/${labourId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch labour details' };
  }
};

/**
 * Verify a labour (Admin only)
 * @param {string} labourId - Labour ID
 * @returns {Promise} API response
 */
export const verifyLabour = async (labourId) => {
  try {
    const response = await api.put(`/labour/${labourId}/verify`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to verify labour' };
  }
};

/**
 * Admin login
 * @param {string} email - Admin email
 * @param {string} password - Admin password
 * @returns {Promise} API response
 */
export const adminLogin = async (email, password) => {
  try {
    const response = await api.post('/auth/admin/login', { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to login' };
  }
};

/**
 * Verify admin token
 * @returns {Promise} API response
 */
export const verifyAdminToken = async () => {
  try {
    const response = await api.get('/auth/admin/verify');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Token verification failed' };
  }
};

/**
 * Get admin token from localStorage
 * @returns {string|null} Admin token or null
 */
export const getAdminToken = () => {
  return localStorage.getItem('adminToken');
};

/**
 * Check if user is admin (by checking token existence)
 * Note: This is a frontend check. Backend always validates the token.
 * @returns {boolean} True if admin token exists
 */
export const isAdmin = () => {
  return !!localStorage.getItem('adminToken');
};

/**
 * Logout admin (remove token)
 */
export const adminLogout = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminEmail');
};

export default api;

