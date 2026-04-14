/**
 * useDevices — manages device list state, server-side pagination/search,
 * and optimistic UI updates for camera block/unblock actions.
 */
import { useState, useEffect, useCallback } from 'react';
import deviceService from '../services/deviceService';

export function useDevices() {
  const [devices, setDevices] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDevices = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await deviceService.getDevices(params);
      setDevices(data?.devices ?? data?.records ?? []);
      if (data?.pagination ?? data?.meta) {
        setPagination(data.pagination ?? data.meta);
      }
    } catch (err) {
      setError(err.message || 'Failed to load devices');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  /**
   * Block the camera on a device and optimistically update local state.
   * @returns {{ success: boolean, error?: string }}
   */
  const blockCamera = useCallback(async (deviceId, reason) => {
    setActionLoading(true);
    try {
      const updated = await deviceService.blockCamera(deviceId, reason);
      setDevices((prev) =>
        prev.map((d) => (d.id === deviceId ? { ...d, ...updated, camera_blocked: true } : d))
      );
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error?.message || err.message || 'Failed to block camera',
      };
    } finally {
      setActionLoading(false);
    }
  }, []);

  /**
   * Unblock the camera on a device and optimistically update local state.
   * @returns {{ success: boolean, error?: string }}
   */
  const unblockCamera = useCallback(async (deviceId, reason) => {
    setActionLoading(true);
    try {
      const updated = await deviceService.unblockCamera(deviceId, reason);
      setDevices((prev) =>
        prev.map((d) => (d.id === deviceId ? { ...d, ...updated, camera_blocked: false } : d))
      );
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error?.message || err.message || 'Failed to unblock camera',
      };
    } finally {
      setActionLoading(false);
    }
  }, []);

  return {
    devices,
    pagination,
    loading,
    error,
    actionLoading,
    fetchDevices,
    blockCamera,
    unblockCamera,
  };
}

export default useDevices;
