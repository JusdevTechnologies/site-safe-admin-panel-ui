/**
 * Device Service
 * Handles device listing and camera block/unblock operations.
 */
import apiClient from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

const extractData = (response) => response.data.data;

export const deviceService = {
  /**
   * Paginated, filterable device list.
   * Supported params: page, limit, search, status, os, sortBy, sortOrder
   */
  getDevices: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.DEVICES, { params });
    return { devices: response.data.data, meta: response.data.meta };
  },

  /**
   * Block the camera on a specific device.
   * @param {string} deviceId - UUID of the device
   * @param {string} [reason] - Optional reason for audit trail
   */
  blockCamera: async (deviceId, reason) => {
    const response = await apiClient.post(
      API_ENDPOINTS.BLOCK_CAMERA(deviceId),
      { reason }
    );
    return extractData(response);
  },

  /**
   * Unblock the camera on a specific device.
   * @param {string} deviceId - UUID of the device
   * @param {string} [reason] - Optional reason for audit trail
   */
  unblockCamera: async (deviceId, reason) => {
    const response = await apiClient.post(
      API_ENDPOINTS.UNBLOCK_CAMERA(deviceId),
      { reason }
    );
    return extractData(response);
  }
};

export default deviceService;
