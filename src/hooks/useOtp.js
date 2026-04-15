/**
 * useOtp — manages OTP list state, per-device current OTP,
 * and OTP generation/verification actions.
 */
import { useState, useEffect, useCallback } from 'react';
import otpService from '../services/otpService';

export function useOtp() {
  const [otpList, setOtpList] = useState([]);
  const [otpSummary, setOtpSummary] = useState({ total: 0, used: 0, pending: 0, expired: 0 });
  const [currentOtp, setCurrentOtp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);

  const fetchAllOtps = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await otpService.getAllOtps(params);
      const list = data?.data ?? data?.otps ?? data?.records ?? [];
      setOtpList(list);

      const meta = data?.meta ?? data?.pagination ?? {};
      setOtpSummary({
        total: meta.total ?? list.length,
        used: list.filter((o) => o.status === 'used').length,
        pending: list.filter((o) => o.status === 'pending').length,
        expired: list.filter((o) => o.status === 'expired').length,
      });
    } catch (err) {
      setError(err.message || 'Failed to load OTP list');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllOtps();
  }, [fetchAllOtps]);

  /**
   * Fetch the currently active OTP for a specific device.
   * Silently clears currentOtp if none exists.
   */
  const fetchCurrentOtp = useCallback(async (deviceId) => {
    if (!deviceId) {
      setCurrentOtp(null);
      return null;
    }
    try {
      const data = await otpService.getCurrentOtp(deviceId);
      setCurrentOtp(data);
      return data;
    } catch {
      setCurrentOtp(null);
      return null;
    }
  }, []);

  /**
   * Generate a new OTP for the given device.
   * Refreshes the list on success.
   * @returns {{ success: boolean, data?: object, error?: string }}
   */
  const generateOtp = useCallback(
    async (deviceId) => {
      setGenerating(true);
      try {
        const data = await otpService.generateOtp(deviceId);
        setCurrentOtp(data);
        await fetchAllOtps();
        return { success: true, data };
      } catch (err) {
        return {
          success: false,
          error: err.response?.data?.error?.message || err.message || 'Failed to generate OTP',
        };
      } finally {
        setGenerating(false);
      }
    },
    [fetchAllOtps]
  );

  return {
    otpList,
    otpSummary,
    currentOtp,
    loading,
    error,
    generating,
    fetchAllOtps,
    fetchCurrentOtp,
    generateOtp,
  };
}

export default useOtp;
