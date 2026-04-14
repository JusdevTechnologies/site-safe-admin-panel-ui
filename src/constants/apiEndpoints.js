/**
 * API Endpoints Configuration
 * Based on Postman collection: Site Safe Admin Panel - Complete APIs
 * Base URL: http://localhost:3000 (override via REACT_APP_API_URL)
 */
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  // Admin Authentication
  LOGIN: '/admin/auth/login',
  REFRESH_TOKEN: '/admin/auth/refresh',
  GET_ME: '/admin/auth/me',
  LOGOUT: '/admin/auth/logout',

  // Dashboard
  DASHBOARD_STATS: '/admin/dashboard/stats',
  DASHBOARD_ACTIVITIES: '/admin/dashboard/activities',
  DASHBOARD_DEVICE_HISTORY: '/admin/dashboard/history',
  DASHBOARD_OTP_SUMMARY: '/admin/dashboard/otp-summary',

  // Device Management
  DEVICES: '/admin/devices',
  BLOCK_CAMERA: (deviceId) => `/admin/devices/${deviceId}/block-camera`,
  UNBLOCK_CAMERA: (deviceId) => `/admin/devices/${deviceId}/unblock-camera`,

  // OTP Management
  OTP_GENERATE: '/admin/otp/generate',
  OTP_CURRENT: '/admin/otp/current',
  OTP_HISTORY: '/admin/otp/history',
  OTP_LIST: '/admin/otp',
  OTP_VERIFY: '/admin/otp/verify',

  // User Management
  USERS: '/admin/users',
  USER: (userId) => `/admin/users/${userId}`,
};
