/**
 * Dashboard Service
 * Aggregates all dashboard-related API calls.
 */
import apiClient from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

const extractData = (response) => response.data.data;

export const dashboardService = {
  /**
   * Key device statistics.
   * Supports optional query params: startDate, endDate, deviceStatus
   */
  getStats: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.DASHBOARD_STATS, { params });
    return extractData(response);
  },

  /**
   * Paginated recent employee activity records.
   */
  getActivities: async (params = { page: 1, limit: 20 }) => {
    const response = await apiClient.get(API_ENDPOINTS.DASHBOARD_ACTIVITIES, { params });
    return extractData(response);
  },

  /**
   * Paginated audit trail of device block/unblock operations.
   */
  getDeviceHistory: async (params = { page: 1, limit: 20 }) => {
    const response = await apiClient.get(API_ENDPOINTS.DASHBOARD_DEVICE_HISTORY, { params });
    return extractData(response);
  },

  /**
   * OTP generation summary statistics.
   * Supports optional query params: startDate, endDate
   */
  getOtpSummary: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.DASHBOARD_OTP_SUMMARY, { params });
    return extractData(response);
  },
};

export default dashboardService;
