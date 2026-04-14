/**
 * Utility Helper Functions
 */

/**
 * Format date to readable format
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format date and time
 */
export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format time in 12-hour format
 */
export const formatTime = (timeString) => {
  const date = new Date(timeString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

/**
 * Get initials from name
 */
export const getInitials = (name) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

/**
 * Truncate text
 */
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Capitalize first letter
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Convert status to badge color
 */
export const getStatusColor = (status) => {
  const statusMap = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    blocked: 'bg-red-100 text-red-800',
    success: 'bg-green-100 text-green-800',
    failure: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
  };
  return statusMap[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

/**
 * Format device status for display
 */
export const formatDeviceStatus = (status) => {
  const statusMap = {
    active: { text: 'Active', color: 'success' },
    inactive: { text: 'Inactive', color: 'secondary' },
    blocked: { text: 'Camera Blocked', color: 'danger' },
    unblocked: { text: 'Camera Unblocked', color: 'success' },
  };
  return statusMap[status?.toLowerCase()] || { text: status, color: 'secondary' };
};
