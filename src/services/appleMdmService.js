import apiClient from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

const extractData = (response) => response.data.data;

export const appleMdmService = {
  getDevices: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.APPLE_MDM_DEVICES, { params });
    return { devices: response.data.data?.devices ?? [], meta: response.data.meta };
  },

  getDevice: async (deviceId) => {
    const response = await apiClient.get(API_ENDPOINTS.APPLE_MDM_DEVICE(deviceId));
    return extractData(response);
  },

  disableCamera: async (deviceId) => {
    const response = await apiClient.post(API_ENDPOINTS.APPLE_MDM_DISABLE_CAMERA(deviceId));
    return extractData(response);
  },

  enableCamera: async (deviceId) => {
    const response = await apiClient.post(API_ENDPOINTS.APPLE_MDM_ENABLE_CAMERA(deviceId));
    return extractData(response);
  },

  refreshDevice: async (deviceId) => {
    const response = await apiClient.post(API_ENDPOINTS.APPLE_MDM_REFRESH(deviceId));
    return extractData(response);
  },

  getCommands: async (deviceId, params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.APPLE_MDM_COMMANDS(deviceId), { params });
    return { commands: response.data.data?.commands ?? response.data.data ?? [], meta: response.data.meta };
  },

  syncDevices: async () => {
    const response = await apiClient.post(API_ENDPOINTS.APPLE_MDM_SYNC);
    return extractData(response);
  }
};

export default appleMdmService;
