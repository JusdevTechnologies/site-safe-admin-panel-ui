import { useState, useEffect, useRef } from "react";
import {
  Users,
  UserPlus,
  Pencil,
  Trash2,
  Search,
  RefreshCw,
  Filter,
  X
} from "lucide-react";
import { MainLayout } from "../../components/Layout";
import { Card, Table, Badge, Button, Input, Modal } from "../../components/Common";
import { formatDateTime } from "../../utils/helpers";
import useEmployees from "../../hooks/useEmployees";

const INITIAL_FORM = {
  employeeId: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  department: "",
  deviceOs: "android",
  status: "active"
};

function EmployeeManagement() {
  const {
    employees,
    pagination,
    loading,
    error,
    submitting,
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
  } = useEmployees();

  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deletingEmployee, setDeletingEmployee] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});

  const searchTimer = useRef(null);

  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      fetchEmployees({ search: searchTerm || undefined });
    }, 400);
    return () => clearTimeout(searchTimer.current);
  }, [searchTerm, fetchEmployees]);

  useEffect(() => {
    if (!notification) return;
    const t = setTimeout(() => setNotification(null), 4000);
    return () => clearTimeout(t);
  }, [notification]);

  const validateForm = () => {
    const errors = {};
    if (!form.employeeId?.trim()) errors.employeeId = "Employee ID is required";
    if (!form.firstName?.trim()) errors.firstName = "First name is required";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Invalid email format";
    if (!form.deviceOs) errors.deviceOs = "Device OS is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const openCreateModal = () => {
    setEditingEmployee(null);
    setForm(INITIAL_FORM);
    setFormErrors({});
    setShowFormModal(true);
  };

  const openEditModal = (employee) => {
    setEditingEmployee(employee);
    setForm({
      employeeId: employee.employeeId ?? "",
      firstName: employee.firstName ?? "",
      lastName: employee.lastName ?? "",
      email: employee.email ?? "",
      phone: employee.phone ?? "",
      department: employee.department ?? "",
      deviceOs: employee.deviceOs ?? "android",
      status: employee.status ?? "active"
    });
    setFormErrors({});
    setShowFormModal(true);
  };

  const closeFormModal = () => {
    setShowFormModal(false);
    setEditingEmployee(null);
    setForm(INITIAL_FORM);
    setFormErrors({});
  };

  const openDeleteModal = (employee) => {
    setDeletingEmployee(employee);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingEmployee(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = { ...form };
    if (!payload.lastName) delete payload.lastName;
    if (!payload.email) delete payload.email;
    if (!payload.phone) delete payload.phone;
    if (!payload.department) delete payload.department;

    const result = editingEmployee
      ? await updateEmployee(editingEmployee.id, payload)
      : await createEmployee(payload);

    if (result.success) {
      closeFormModal();
      setNotification({
        type: "success",
        message: `Employee ${editingEmployee ? "updated" : "created"} successfully`
      });
    } else {
      setNotification({ type: "error", message: result.error });
    }
  };

  const handleDelete = async () => {
    if (!deletingEmployee) return;
    const result = await deleteEmployee(deletingEmployee.id);
    closeDeleteModal();
    setNotification(
      result.success
        ? { type: "success", message: "Employee deleted successfully" }
        : { type: "error", message: result.error }
    );
  };

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const employeeColumns = [
    {
      key: "employeeId",
      label: "Employee ID",
      render: (row) => <span className="font-medium">{row.employeeId ?? "—"}</span>
    },
    {
      key: "firstName",
      label: "Name",
      render: (row) => `${row.firstName ?? ""} ${row.lastName ?? ""}`.trim() || "—"
    },
    { key: "email", label: "Email", render: (row) => row.email ?? "—" },
    { key: "phone", label: "Phone", render: (row) => row.phone ?? "—" },
    { key: "department", label: "Department", render: (row) => row.department ?? "—" },
    {
      key: "deviceOs",
      label: "Device OS",
      render: (row) => row.deviceOs ? <Badge variant={row.deviceOs === "android" ? "success" : "info"}>{row.deviceOs}</Badge> : "—"
    },
    {
      key: "status",
      label: "Status",
      render: (row) =>
        row.status === "active"
          ? <Badge variant="success">Active</Badge>
          : <Badge variant="secondary">Inactive</Badge>
    },
    {
      key: "createdAt",
      label: "Created",
      render: (row) => row.createdAt ? formatDateTime(row.createdAt) : "—"
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-xs gap-1" onClick={() => openEditModal(row)}>
            <Pencil size={14} /> Edit
          </Button>
          <Button variant="danger" size="sm" className="text-xs gap-1" onClick={() => openDeleteModal(row)}>
            <Trash2 size={14} /> Delete
          </Button>
        </div>
      )
    }
  ];

  return (
    <MainLayout title="Employee Management">
      {notification && (
        <div
          className={`mb-4 p-3 rounded-lg flex items-center justify-between text-sm ${
            notification.type === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {notification.message}
          <button onClick={() => setNotification(null)} className="ml-4 hover:opacity-70">
            <X size={14} />
          </button>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by employee ID, name, or email…"
              prefix={<Search size={18} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2" onClick={() => { setSearchTerm(""); fetchEmployees(); }}>
            <Filter size={18} /> Clear
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => fetchEmployees()}>
            <RefreshCw size={18} /> Refresh
          </Button>
          <Button variant="primary" className="gap-2" onClick={openCreateModal}>
            <UserPlus size={18} /> Add Employee
          </Button>
        </div>
      </Card>

      <Card title="Employees" subtitle={`${pagination.total ?? employees.length} total employees`}>
        {loading ? (
          <div className="py-12 text-center text-gray-400">
            <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-800 rounded-full animate-spin mx-auto mb-3" />
            Loading employees…
          </div>
        ) : employees.length === 0 ? (
          <div className="py-12 text-center text-gray-400">No employees found</div>
        ) : (
          <Table columns={employeeColumns} data={employees} />
        )}
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <div className="text-center">
            <Users size={32} className="text-blue-600 mx-auto mb-2" />
            <p className="text-gray-600 text-sm mb-2">Total Employees</p>
            <p className="text-3xl font-bold">{pagination.total ?? employees.length}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <Badge variant="success" className="text-lg mb-2 mx-auto w-fit">Active</Badge>
            <p className="text-gray-600 text-sm mb-2">Active Employees</p>
            <p className="text-3xl font-bold text-green-600">
              {employees.filter(e => e.status === "active").length}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <Badge variant="secondary" className="text-lg mb-2 mx-auto w-fit">Inactive</Badge>
            <p className="text-gray-600 text-sm mb-2">Inactive Employees</p>
            <p className="text-3xl font-bold text-gray-500">
              {employees.filter(e => e.status !== "active").length}
            </p>
          </div>
        </Card>
      </div>

      {/* Create/Edit Form Modal */}
      <Modal
        isOpen={showFormModal}
        onClose={closeFormModal}
        title={editingEmployee ? "Edit Employee" : "Add Employee"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Employee ID <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="E.g. EMP001"
                value={form.employeeId}
                onChange={(e) => handleFormChange("employeeId", e.target.value)}
                error={formErrors.employeeId}
                disabled={!!editingEmployee}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Device OS <span className="text-red-500">*</span>
              </label>
              <select
                value={form.deviceOs}
                onChange={(e) => handleFormChange("deviceOs", e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                  formErrors.deviceOs ? "border-red-300" : "border-gray-300"
                }`}
              >
                <option value="android">Android</option>
                <option value="ios">iOS</option>
              </select>
              {formErrors.deviceOs && <p className="text-red-500 text-xs mt-1">{formErrors.deviceOs}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                First Name <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="John"
                value={form.firstName}
                onChange={(e) => handleFormChange("firstName", e.target.value)}
                error={formErrors.firstName}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
              <Input
                placeholder="Doe"
                value={form.lastName}
                onChange={(e) => handleFormChange("lastName", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <Input
                placeholder="john.doe@company.com"
                value={form.email}
                onChange={(e) => handleFormChange("email", e.target.value)}
                error={formErrors.email}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
              <Input
                placeholder="+1234567890"
                value={form.phone}
                onChange={(e) => handleFormChange("phone", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Department</label>
              <Input
                placeholder="Engineering"
                value={form.department}
                onChange={(e) => handleFormChange("department", e.target.value)}
              />
            </div>
            {editingEmployee && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => handleFormChange("status", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <Button variant="secondary" type="button" onClick={closeFormModal} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={submitting}>
              {editingEmployee ? "Update Employee" : "Create Employee"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={closeDeleteModal} title="Delete Employee" size="sm">
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete <strong>{deletingEmployee?.firstName} {deletingEmployee?.lastName}</strong> ({deletingEmployee?.employeeId})?
          </p>
          <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            This action performs a soft delete. The record will be retained for audit purposes.
          </p>
        </div>
        <div className="flex gap-3 mt-6">
          <Button variant="secondary" onClick={closeDeleteModal} disabled={submitting}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} isLoading={submitting}>
            <Trash2 size={16} /> Delete Employee
          </Button>
        </div>
      </Modal>
    </MainLayout>
  );
}

export default EmployeeManagement;
