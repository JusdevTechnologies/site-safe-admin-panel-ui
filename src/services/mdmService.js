/**
 * MDM Management Service
 * Handles NanoMDM device listing, profile management, and command tracking.
 */
import apiClient from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

const extractData = (response) => response.data.data;

export const mdmService = {
  getDevices: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.MDM_DEVICES, { params });
    return { devices: response.data.data?.devices ?? [], meta: response.data.meta };
  },

  getProfiles: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.MDM_PROFILES, { params });
    return { profiles: response.data.data?.profiles ?? [], meta: response.data.meta };
  },

  installProfile: async (udid, profilePayload) => {
    const response = await apiClient.post(API_ENDPOINTS.MDM_INSTALL_PROFILE, { udid, profilePayload });
    return extractData(response);
  },

  removeProfile: async (udid, profileIdentifier) => {
    const response = await apiClient.post(API_ENDPOINTS.MDM_REMOVE_PROFILE, { udid, profileIdentifier });
    return extractData(response);
  },

  getCommands: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.MDM_COMMANDS, { params });
    return { commands: response.data.data ?? [], meta: response.data.meta };
  }
};

export default mdmService;
