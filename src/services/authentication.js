/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
import apiClient from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const authService = {
  /**
   * Login user with credentials
   */
  login: async (credentials) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.LOGIN, credentials);
      const { token, user } = response.data;

      // Store token and user info
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      return { token, user };
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Logout user
   */
  logout: async () => {
    try {
      await apiClient.post(API_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear stored credentials regardless of API response
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  /**
   * Verify token validity
   */
  verifyToken: async () => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.VERIFY_TOKEN);
      return response.data.valid;
    } catch (error) {
      return false;
    }
  },

  /**
   * Get stored user from localStorage
   */
  getStoredUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export default authService;
