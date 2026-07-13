/**
 * useMdm — manages MDM devices, profiles, commands, and profile install/remove.
 */
import { useState, useCallback } from "react";
import mdmService from "../services/mdmService";

export function useMdm() {
  const [devices, setDevices] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [commands, setCommands] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDevices = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await mdmService.getDevices(params);
      setDevices(data?.devices ?? []);
      if (data?.meta) setPagination(data.meta);
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || "Failed to load MDM devices");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProfiles = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await mdmService.getProfiles(params);
      setProfiles(data?.profiles ?? []);
      if (data?.meta) setPagination(data.meta);
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || "Failed to load MDM profiles");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCommands = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await mdmService.getCommands(params);
      setCommands(data?.commands ?? []);
      if (data?.meta) setPagination(data.meta);
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || "Failed to load MDM commands");
    } finally {
      setLoading(false);
    }
  }, []);

  const installProfile = useCallback(async (udid, profilePayload) => {
    setActionLoading(true);
    try {
      const result = await mdmService.installProfile(udid, profilePayload);
      return { success: true, data: result };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error?.message || err.response?.data?.message || err.message || "Failed to install profile"
      };
    } finally {
      setActionLoading(false);
    }
  }, []);

  const removeProfile = useCallback(async (udid, profileIdentifier) => {
    setActionLoading(true);
    try {
      const result = await mdmService.removeProfile(udid, profileIdentifier);
      return { success: true, data: result };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error?.message || err.response?.data?.message || err.message || "Failed to remove profile"
      };
    } finally {
      setActionLoading(false);
    }
  }, []);

  return {
    devices,
    profiles,
    commands,
    pagination,
    loading,
    error,
    actionLoading,
    fetchDevices,
    fetchProfiles,
    fetchCommands,
    installProfile,
    removeProfile
  };
}

export default useMdm;
