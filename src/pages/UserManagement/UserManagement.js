/**
 * User Management Page
 * Full CRUD for admin users — all operations are backed by the API.
 */
import { useState, useEffect, useRef } from "react";
import { Plus, Edit, Trash2, Search, RefreshCw, X } from "lucide-react";
import { MainLayout } from "../../components/Layout";
import {
  Card,
  Table,
  Badge,
  Button,
  Input,
  Modal
} from "../../components/Common";
import { formatDateTime } from "../../utils/helpers";
import UserFormModal from "./UserFormModal";
import useUsers from "../../hooks/useUsers";

function UserManagement() {
  const {
    users,
    loading,
    error,
    submitting,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser
  } = useUsers();

  const [searchTerm, setSearchTerm] = useState("");
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [notification, setNotification] = useState(null);

  const searchTimer = useRef(null);

  // ─── Debounced server-side search ─────────────────────────────────────────
  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      fetchUsers({ search: searchTerm || undefined });
    }, 400);
    return () => clearTimeout(searchTimer.current);
  }, [searchTerm, fetchUsers]);

  // ─── Auto-dismiss notification ────────────────────────────────────────────
  useEffect(() => {
    if (!notification) return;
    const t = setTimeout(() => setNotification(null), 4000);
    return () => clearTimeout(t);
  }, [notification]);

  const handleAddUser = () => {
    setFormMode("add");
    setSelectedUser(null);
    setShowFormModal(true);
  };

  const handleEditUser = (user) => {
    setFormMode("edit");
    setSelectedUser(user);
    setShowFormModal(true);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    const result = await deleteUser(userToDelete.id);
    setShowDeleteModal(false);
    setUserToDelete(null);
    setNotification(
      result.success
        ? { type: "success", message: "User deleted successfully" }
        : { type: "error", message: result.error }
    );
  };

  const handleSaveUser = async (userData) => {
    const result =
      formMode === "add"
        ? await createUser(userData)
        : await updateUser(selectedUser.id, userData);

    if (result.success) {
      setShowFormModal(false);
      setNotification({
        type: "success",
        message:
          formMode === "add"
            ? "User created successfully"
            : "User updated successfully"
      });
    } else {
      setNotification({ type: "error", message: result.error });
    }
    return result;
  };

  const displayName = (user) =>
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.username ||
    "—";

  const userColumns = [
    {
      key: "name",
      label: "Name",
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">{displayName(row)}</p>
          <p className="text-xs text-gray-500">@{row.username}</p>
        </div>
      )
    },
    { key: "email", label: "Email" },
    {
      key: "role",
      label: "Role",
      render: (row) => (
        <Badge variant={row.role === "super_admin" ? "primary" : "default"}>
          {row.role === "super_admin" ? "Super Admin" : "Admin"}
        </Badge>
      )
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge variant={row.status === "active" ? "success" : "default"}>
          {row.status ?? "—"}
        </Badge>
      )
    },
    {
      key: "created_at",
      label: "Created",
      render: (row) => (row.created_at ? formatDateTime(row.created_at) : "—")
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleEditUser(row)}
            className="text-xs gap-1"
          >
            <Edit size={14} /> Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDeleteClick(row)}
            className="text-xs gap-1"
          >
            <Trash2 size={14} /> Delete
          </Button>
        </div>
      )
    }
  ];

  const activeCount = users.filter((u) => u.status === "active").length;
  const superAdminCount = users.filter((u) => u.role === "super_admin").length;

  return (
    <MainLayout title="User Management">
      {/* Notification */}
      {notification && (
        <div
          className={`mb-4 p-3 rounded-lg flex items-center justify-between text-sm ${
            notification.type === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {notification.message}
          <button
            onClick={() => setNotification(null)}
            className="ml-4 hover:opacity-70"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Search + Add */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-start md:items-center">
        <Input
          placeholder="Search by name, username, or email…"
          prefix={<Search size={18} />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          containerClassName="flex-1"
        />
        <div className="flex gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => fetchUsers()}
          >
            <RefreshCw size={18} /> Refresh
          </Button>
          <Button variant="primary" onClick={handleAddUser} className="gap-2">
            <Plus size={18} /> Add User
          </Button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Users Table */}
      <Card
        title="Admin Users"
        subtitle={`Total: ${users.length} user${users.length !== 1 ? "s" : ""}`}
      >
        {loading ? (
          <div className="py-12 text-center text-gray-400">Loading users…</div>
        ) : users.length === 0 ? (
          <div className="py-12 text-center text-gray-400">No users found</div>
        ) : (
          <Table columns={userColumns} data={users} />
        )}
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2">Total Users</p>
            <p className="text-3xl font-bold">{users.length}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2">Active Users</p>
            <p className="text-3xl font-bold text-green-600">{activeCount}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2">Super Admins</p>
            <p className="text-3xl font-bold text-blue-600">
              {superAdminCount}
            </p>
          </div>
        </Card>
      </div>

      {/* User Form Modal */}
      <UserFormModal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSave={handleSaveUser}
        mode={formMode}
        user={selectedUser}
        submitting={submitting}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete User"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete{" "}
            <strong>{userToDelete ? displayName(userToDelete) : ""}</strong>?
          </p>
          <p className="text-sm text-gray-600">
            This performs a soft delete — the record is preserved in the audit
            trail.
          </p>
        </div>
        <div className="flex gap-3 mt-6">
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmDelete}
            isLoading={submitting}
          >
            Delete User
          </Button>
        </div>
      </Modal>
    </MainLayout>
  );
}

export default UserManagement;
