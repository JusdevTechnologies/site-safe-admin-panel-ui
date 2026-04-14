/**
 * Route Configuration
 */
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  DEVICE_MANAGEMENT: '/devices',
  UNINSTALL_OTP: '/otp',
  USER_MANAGEMENT: '/users',
};

/**
 * Navigation Menu Items
 */
export const MENU_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: ROUTES.DASHBOARD,
    icon: 'BarChart3',
  },
  {
    id: 'devices',
    label: 'Device Management',
    path: ROUTES.DEVICE_MANAGEMENT,
    icon: 'Smartphone',
  },
  {
    id: 'otp',
    label: 'Uninstall OTP',
    path: ROUTES.UNINSTALL_OTP,
    icon: 'KeyRound',
  },
  {
    id: 'users',
    label: 'User Management',
    path: ROUTES.USER_MANAGEMENT,
    icon: 'Users',
  },
];
