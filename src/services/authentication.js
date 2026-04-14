/**
 * Authentication Service
 * Handles all auth-related API calls and token lifecycle.
 *
 * Login uses a plain axios call to avoid triggering the refresh interceptor
 * before tokens are stored. All other calls use the shared apiClient.
 */
import axios from "axios";
import apiClient from "./api";
import { API_BASE_URL, API_ENDPOINTS } from "../constants/apiEndpoints";
import tokenStorage from "./tokenStorage";

const extractApiError = (error) =>
  error.response?.data?.error?.message ||
  error.message ||
  "An unexpected error occurred";

export const authService = {
  /**
   * Authenticate with username + password.
   * Stores access token, refresh token and user profile in localStorage.
   * Returns the user object on success; throws on failure.
   */
  login: async ({ username, password }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.LOGIN}`,
        { username, password },
        { headers: { "Content-Type": "application/json" }, timeout: 15_000 }
      );
      // API returns camelCase token keys; normalise to snake_case for tokenStorage.
      const { user, accessToken, refreshToken } = response.data.data;
      tokenStorage.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
        user
      });
      return { user };
    } catch (error) {
      throw new Error(extractApiError(error));
    }
  },

  /**
   * Invalidate the server session and clear local storage.
   * Local storage is always cleared regardless of API result.
   */
  logout: async () => {
    try {
      await apiClient.post(API_ENDPOINTS.LOGOUT);
    } catch {
      // Intentionally swallowed — always clear local state.
    } finally {
      tokenStorage.clear();
    }
  },

  /**
   * Fetch the current authenticated user's profile.
   * Updates the stored user object on success.
   */
  getMe: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.GET_ME);
      const user = response.data.data;
      tokenStorage.setSession({ user });
      return user;
    } catch (error) {
      throw new Error(extractApiError(error));
    }
  },

  getStoredUser: () => tokenStorage.getUser(),
  isAuthenticated: () => tokenStorage.isAuthenticated()
};

export default authService;
