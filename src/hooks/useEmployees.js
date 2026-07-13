/**
 * useEmployees — manages employee list state, pagination, and CRUD operations.
 */
import { useState, useEffect, useCallback } from "react";
import employeeService from "../services/employeeService";

export function useEmployees() {
  const [employees, setEmployees] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchEmployees = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await employeeService.getEmployees(params);
      setEmployees(data?.employees ?? []);
      if (data?.meta) {
        setPagination(data.meta);
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || "Failed to load employees");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const createEmployee = useCallback(async (data) => {
    setSubmitting(true);
    try {
      const result = await employeeService.createEmployee(data);
      await fetchEmployees();
      return { success: true, data: result };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error?.message || err.response?.data?.message || err.response?.data?.errors?.[0] || err.message || "Failed to create employee"
      };
    } finally {
      setSubmitting(false);
    }
  }, [fetchEmployees]);

  const updateEmployee = useCallback(async (employeeId, data) => {
    setSubmitting(true);
    try {
      const result = await employeeService.updateEmployee(employeeId, data);
      await fetchEmployees();
      return { success: true, data: result };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error?.message || err.response?.data?.message || err.message || "Failed to update employee"
      };
    } finally {
      setSubmitting(false);
    }
  }, [fetchEmployees]);

  const deleteEmployee = useCallback(async (employeeId) => {
    setSubmitting(true);
    try {
      await employeeService.deleteEmployee(employeeId);
      await fetchEmployees();
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error?.message || err.message || "Failed to delete employee"
      };
    } finally {
      setSubmitting(false);
    }
  }, [fetchEmployees]);

  return {
    employees,
    pagination,
    loading,
    error,
    submitting,
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
  };
}

export default useEmployees;
