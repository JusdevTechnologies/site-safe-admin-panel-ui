/**
 * API Endpoints Configuration
 * Based on Postman collection: Site Safe Admin Panel - Complete APIs
 * Base host: http://localhost:3000 (override via REACT_APP_API_URL — host only, no trailing slash)
 * All endpoints are under /api/v1.
 */
const BASE_HOST = process.env.REACT_APP_API_URL || "http://localhost:3000";
export const API_BASE_URL = `${BASE_HOST}/api/v1`;

export const API_ENDPOINTS = {
  // Admin Authentication
  LOGIN: "/auth/admin/login",
  REFRESH_TOKEN: "/auth/refresh",
  GET_ME: "/auth/me",
  LOGOUT: "/auth/logout",

  // Dashboard
  DASHBOARD_STATS: "/admin/dashboard/stats",
  DASHBOARD_ACTIVITIES: "/admin/dashboard/activities",
  DASHBOARD_DEVICE_HISTORY: "/admin/dashboard/device-history",
  DASHBOARD_OTP_SUMMARY: "/admin/dashboard/otp-summary",

  // Device Management
  DEVICES: "/admin/devices",
  BLOCK_CAMERA: (deviceId) => `/admin/devices/${deviceId}/block`,
  UNBLOCK_CAMERA: (deviceId) => `/admin/devices/${deviceId}/unblock`,

  // OTP Management
  OTP_GENERATE: "/admin/otp/generate",
  OTP_CURRENT: (deviceId) => `/admin/otp/device/${deviceId}`,
  OTP_HISTORY: (deviceId) => `/admin/otp/device/${deviceId}/history`,
  OTP_LIST: "/admin/otp",
  OTP_VERIFY: "/otp/verify",

  // User Management
  USERS: "/admin/users",
  USER: (userId) => `/admin/users/${userId}`,

  // MDM Management
  MDM_DEVICES: "/admin/mdm/devices",
  MDM_TOGGLE_REMOVABLE: (deviceId) =>
    `/admin/mdm/devices/${deviceId}/removable`,
  MDM_PROFILES: "/admin/mdm/profiles",
  MDM_INSTALL_PROFILE: "/admin/mdm/profile/install",
  MDM_REMOVE_PROFILE: "/admin/mdm/profile/remove",
  MDM_COMMANDS: "/admin/mdm/commands",

  // Employee Management
  EMPLOYEES: "/admin/employees",
  EMPLOYEE: (employeeId) => `/admin/employees/${employeeId}`,

  // Apple MDM Management
  APPLE_MDM_DEVICES: "/mdm/devices",
  APPLE_MDM_DEVICE: (deviceId) => `/mdm/devices/${deviceId}`,
  APPLE_MDM_DISABLE_CAMERA: (deviceId) =>
    `/mdm/devices/${deviceId}/camera/disable`,
  APPLE_MDM_ENABLE_CAMERA: (deviceId) =>
    `/mdm/devices/${deviceId}/camera/enable`,
  APPLE_MDM_COMMANDS: (deviceId) => `/mdm/devices/${deviceId}/commands`,
  APPLE_MDM_SYNC: "/mdm/sync"
};
