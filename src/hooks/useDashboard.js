/**
 * useDashboard — fetches stats, recent device history, and OTP summary
 * in parallel. Exposes loading/error states and a manual refetch.
 */
import { useState, useEffect, useCallback } from 'react';
import dashboardService from '../services/dashboardService';

export function useDashboard() {
  const [stats, setStats] = useState(null);
  const [deviceHistory, setDeviceHistory] = useState([]);
  const [otpSummary, setOtpSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, historyData, otpData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getDeviceHistory({ page: 1, limit: 20 }),
        dashboardService.getOtpSummary(),
      ]);

      setStats(statsData?.stats ?? statsData);
      // Accept multiple possible list-key shapes from the backend.
      setDeviceHistory(
        historyData?.records ?? historyData?.history ?? historyData?.activities ?? []
      );
      setOtpSummary(otpData?.summary ?? otpData);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return { stats, deviceHistory, otpSummary, loading, error, refetch: fetchDashboardData };
}

export default useDashboard;
