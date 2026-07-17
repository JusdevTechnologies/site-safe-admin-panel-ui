import { useState, useCallback } from "react";
import appleMdmService from "../services/appleMdmService";

export function useAppleMdm() {
  const [devices, setDevices] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDevices = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await appleMdmService.getDevices(params);
      setDevices(data?.devices ?? []);
      if (data?.meta) setPagination(data.meta);
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || "Failed to load Apple MDM devices");
    } finally {
      setLoading(false);
    }
  }, []);

  const disableCamera = useCallback(async (deviceId) => {
    setActionLoading(true);
    try {
      const result = await appleMdmService.disableCamera(deviceId);
      return { success: true, data: result };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error?.message || err.response?.data?.message || err.message || "Failed to disable camera"
      };
    } finally {
      setActionLoading(false);
    }
  }, []);

  const enableCamera = useCallback(async (deviceId) => {
    setActionLoading(true);
    try {
      const result = await appleMdmService.enableCamera(deviceId);
      return { success: true, data: result };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error?.message || err.response?.data?.message || err.message || "Failed to enable camera"
      };
    } finally {
      setActionLoading(false);
    }
  }, []);

  const refreshDevice = useCallback(async (deviceId) => {
    setActionLoading(true);
    try {
      const result = await appleMdmService.refreshDevice(deviceId);
      return { success: true, data: result };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error?.message || err.response?.data?.message || err.message || "Failed to refresh device"
      };
    } finally {
      setActionLoading(false);
    }
  }, []);

  const syncDevices = useCallback(async () => {
    setActionLoading(true);
    try {
      const result = await appleMdmService.syncDevices();
      return { success: true, data: result };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error?.message || err.response?.data?.message || err.message || "Failed to sync devices"
      };
    } finally {
      setActionLoading(false);
    }
  }, []);

  const fetchCommands = useCallback(async (deviceId, params = {}) => {
    try {
      const data = await appleMdmService.getCommands(deviceId, params);
      return { success: true, commands: data?.commands ?? [], meta: data?.meta };
    } catch (err) {
      return {
        success: false,
        commands: [],
        error: err.response?.data?.error?.message || err.message || "Failed to load commands"
      };
    }
  }, []);

  return {
    devices,
    pagination,
    loading,
    error,
    actionLoading,
    fetchDevices,
    disableCamera,
    enableCamera,
    refreshDevice,
    syncDevices,
    fetchCommands
  };
}

export default useAppleMdm;
