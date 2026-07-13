/**
 * Route Configuration
 */
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  DEVICE_MANAGEMENT: '/devices',
  MDM_MANAGEMENT: '/mdm',
  UNINSTALL_OTP: '/otp',
  USER_MANAGEMENT: '/users',
  EMPLOYEE_MANAGEMENT: '/employees',
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
    id: 'mdm',
    label: 'MDM Management',
    path: ROUTES.MDM_MANAGEMENT,
    icon: 'Server',
  },
  {
    id: 'otp',
    label: 'Uninstall OTP',
    path: ROUTES.UNINSTALL_OTP,
    icon: 'KeyRound',
  },
  {
    id: 'employees',
    label: 'Employees',
    path: ROUTES.EMPLOYEE_MANAGEMENT,
    icon: 'BadgeCheck',
  },
  {
    id: 'users',
    label: 'User Management',
    path: ROUTES.USER_MANAGEMENT,
    icon: 'Users',
  },
];
