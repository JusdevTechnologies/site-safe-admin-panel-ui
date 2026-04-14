/**
 * User Service
 * Full CRUD operations for admin user management.
 * Restricted to super_admin role on the backend.
 */
import apiClient from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

const extractData = (response) => response.data.data;

export const userService = {
  /**
   * Paginated, filterable admin user list.
   * Supported params: page, limit, search, status, role, sortBy, sortOrder
   */
  getUsers: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.USERS, { params });
    return extractData(response);
  },

  /**
   * Create a new admin user.
   * Required fields: username, email, password, first_name, last_name, role
   */
  createUser: async (userData) => {
    const response = await apiClient.post(API_ENDPOINTS.USERS, userData);
    return extractData(response);
  },

  /**
   * Retrieve a specific admin user's profile.
   * @param {string} userId - UUID of the user
   */
  getUser: async (userId) => {
    const response = await apiClient.get(API_ENDPOINTS.USER(userId));
    return extractData(response);
  },

  /**
   * Partial update of an admin user (PATCH).
   * Updatable fields: email, first_name, last_name, password, status, role
   * @param {string} userId - UUID of the user
   */
  updateUser: async (userId, userData) => {
    const response = await apiClient.patch(API_ENDPOINTS.USER(userId), userData);
    return extractData(response);
  },

  /**
   * Soft-delete an admin user (record preserved for audit trail).
   * @param {string} userId - UUID of the user
   */
  deleteUser: async (userId) => {
    const response = await apiClient.delete(API_ENDPOINTS.USER(userId));
    return response.data;
  },
};

export default userService;
