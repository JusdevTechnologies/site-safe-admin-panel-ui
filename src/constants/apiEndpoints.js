/**
 * API Endpoints Configuration
 */
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh-token',
  VERIFY_TOKEN: '/auth/verify',

  // Dashboard
  DASHBOARD_STATS: '/dashboard/stats',
  RECENT_ACTIVITIES: '/dashboard/activities',

  // Device Management
  GET_DEVICES: '/devices',
  GET_DEVICE: '/devices/:id',
  BLOCK_DEVICE_CAMERA: '/devices/:id/block-camera',
  UNBLOCK_DEVICE_CAMERA: '/devices/:id/unblock-camera',

  // Uninstall OTP
  GET_CURRENT_OTP: '/otp/current',
  GET_OTP_HISTORY: '/otp/history',
  GENERATE_NEW_OTP: '/otp/generate',

  // User Management
  GET_USERS: '/users',
  CREATE_USER: '/users',
  UPDATE_USER: '/users/:id',
  DELETE_USER: '/users/:id',
  GET_USER: '/users/:id',
};
