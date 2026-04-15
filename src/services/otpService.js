/**
 * OTP Service
 * Manages OTP generation, retrieval and verification for device uninstallation.
 */
import apiClient from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

const extractData = (response) => response.data.data;

export const otpService = {
  /**
   * Generate a new 8-digit OTP for the given device.
   * OTP is valid for 5 minutes and can be used once.
   * @param {string} deviceId - UUID of the device
   */
  generateOtp: async (deviceId) => {
    const response = await apiClient.post(API_ENDPOINTS.OTP_GENERATE, {
      device_id: deviceId
    });
    return extractData(response);
  },

  /**
   * Retrieve the currently active OTP for a specific device.
   * Returns 404 if no active OTP exists.
   * @param {string} deviceId - UUID of the device
   */
  getCurrentOtp: async (deviceId) => {
    const response = await apiClient.get(API_ENDPOINTS.OTP_CURRENT(deviceId));
    return extractData(response);
  },

  /**
   * Paginated OTP history for a specific device.
   * @param {string} deviceId - UUID of the device
   * @param {object} params - page, limit
   */
  getOtpHistory: async (deviceId, params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.OTP_HISTORY(deviceId), {
      params
    });
    return extractData(response);
  },

  /**
   * List all OTPs across all devices (admin view).
   * Supported params: page, limit, status, startDate, endDate
   */
  getAllOtps: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.OTP_LIST, { params });
    return extractData(response);
  },

  /**
   * Verify an OTP for device uninstallation.
   * @param {string} deviceId - UUID of the device
   * @param {string} otpCode  - 8-digit OTP code
   */
  verifyOtp: async (deviceId, otpCode) => {
    const response = await apiClient.post(API_ENDPOINTS.OTP_VERIFY, {
      device_id: deviceId,
      otp_code: otpCode
    });
    return extractData(response);
  }
};

export default otpService;
