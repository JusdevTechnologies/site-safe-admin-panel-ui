/**
 * Services barrel export
 * Import domain services from this single entry point.
 *
 * Usage:
 *   import { dashboardService } from '../services';
 */
export { default as apiClient } from './api';
export { default as tokenStorage } from './tokenStorage';
export { authService, default as authServiceDefault } from './authentication';
export { dashboardService, default as dashboardServiceDefault } from './dashboardService';
export { deviceService, default as deviceServiceDefault } from './deviceService';
export { otpService, default as otpServiceDefault } from './otpService';
export { userService, default as userServiceDefault } from './userService';
export { mdmService, default as mdmServiceDefault } from './mdmService';
export { employeeService, default as employeeServiceDefault } from './employeeService';
export { appleMdmService, default as appleMdmServiceDefault } from './appleMdmService';
