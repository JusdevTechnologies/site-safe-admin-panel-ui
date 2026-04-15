/**
 * useUsers — manages admin user list and all CRUD operations.
 * create/update/delete return { success, data?, error? } for inline feedback.
 */
import { useState, useEffect, useCallback } from "react";
import userService from "../services/userService";

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getUsers(params);
      setUsers(data?.users ?? []);
      if (data?.meta) {
        setPagination(data.meta);
      }
    } catch (err) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const createUser = useCallback(
    async (userData) => {
      setSubmitting(true);
      try {
        const newUser = await userService.createUser(userData);
        await fetchUsers();
        return { success: true, data: newUser };
      } catch (err) {
        return {
          success: false,
          error:
            err.response?.data?.error?.message ||
            err.message ||
            "Failed to create user"
        };
      } finally {
        setSubmitting(false);
      }
    },
    [fetchUsers]
  );

  const updateUser = useCallback(async (userId, userData) => {
    setSubmitting(true);
    try {
      const updated = await userService.updateUser(userId, userData);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, ...updated } : u))
      );
      return { success: true, data: updated };
    } catch (err) {
      return {
        success: false,
        error:
          err.response?.data?.error?.message ||
          err.message ||
          "Failed to update user"
      };
    } finally {
      setSubmitting(false);
    }
  }, []);

  const deleteUser = useCallback(async (userId) => {
    setSubmitting(true);
    try {
      await userService.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error:
          err.response?.data?.error?.message ||
          err.message ||
          "Failed to delete user"
      };
    } finally {
      setSubmitting(false);
    }
  }, []);

  return {
    users,
    pagination,
    loading,
    error,
    submitting,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser
  };
}

export default useUsers;
