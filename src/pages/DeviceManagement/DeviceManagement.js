/**
 * Device Management Page
 * Lists all registered devices and allows admins to block/unblock cameras.
 * All data is sourced from the backend API via the useDevices hook.
 */
import { useState, useEffect, useRef } from "react";
import {
  Shield,
  Lock,
  Unlock,
  Search,
  Filter,
  RefreshCw,
  X
} from "lucide-react";
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
import useDevices from "../../hooks/useDevices";

function DeviceManagement() {
  const {
    devices,
    loading,
    error,
    actionLoading,
    fetchDevices,
    blockCamera,
    unblockCamera
  } = useDevices();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [reason, setReason] = useState("");
  const [showActionModal, setShowActionModal] = useState(false);
  const [notification, setNotification] = useState(null);

  const searchTimer = useRef(null);

  // ─── Debounced server-side search ─────────────────────────────────────────
  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      fetchDevices({
        search: searchTerm || undefined,
        status: statusFilter || undefined
      });
    }, 400);
    return () => clearTimeout(searchTimer.current);
  }, [searchTerm, statusFilter, fetchDevices]);

  // ─── Auto-dismiss notification after 4 s ─────────────────────────────────
  useEffect(() => {
    if (!notification) return;
    const t = setTimeout(() => setNotification(null), 4000);
    return () => clearTimeout(t);
  }, [notification]);

  const openActionModal = (device, type) => {
    setSelectedDevice(device);
    setActionType(type);
    setReason("");
    setShowActionModal(true);
  };

  const closeActionModal = () => {
    setShowActionModal(false);
    setSelectedDevice(null);
    setActionType(null);
    setReason("");
  };

  const handleConfirmAction = async () => {
    if (!selectedDevice) return;
    const fn = actionType === "block" ? blockCamera : unblockCamera;
    const result = await fn(selectedDevice.id, reason || undefined);
    closeActionModal();
    setNotification(
      result.success
        ? {
            type: "success",
            message: `Camera ${actionType === "block" ? "blocked" : "unblocked"} successfully`
          }
        : { type: "error", message: result.error }
    );
  };

  const blockedCount = devices.filter((d) => d.cameraBlocked).length;
  const unblockedCount = devices.filter((d) => !d.cameraBlocked).length;

  const deviceColumns = [
    {
      key: "deviceName",
      label: "Device Name",
      render: (row) => row.deviceName ?? row.deviceIdentifier ?? "—"
    },
    {
      key: "deviceIdentifier",
      label: "Device ID",
      render: (row) => row.deviceIdentifier ?? "—"
    },
    {
      key: "employee",
      label: "Employee",
      render: (row) =>
        row.employee?.employeeId ?? row.employeeId ?? row.user ?? "—"
    },
    {
      key: "deviceOs",
      label: "OS",
      render: (row) => row.deviceOs ?? row.os ?? "—"
    },
    {
      key: "cameraBlocked",
      label: "Camera Status",
      render: (row) =>
        row.cameraBlocked ? (
          <Badge variant="danger">Blocked</Badge>
        ) : (
          <Badge variant="success">Active</Badge>
        )
    },
    {
      key: "lastSync",
      label: "Last Active",
      render: (row) => (row.lastSync ? formatDateTime(row.lastSync) : "—")
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          {row.cameraBlocked ? (
            <Button
              variant="success"
              size="sm"
              onClick={() => openActionModal(row, "unblock")}
              className="text-xs gap-1"
              disabled={actionLoading}
            >
              <Unlock size={14} /> Unblock
            </Button>
          ) : (
            <Button
              variant="danger"
              size="sm"
              onClick={() => openActionModal(row, "block")}
              className="text-xs gap-1"
              disabled={actionLoading}
            >
              <Lock size={14} /> Block
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <MainLayout title="Device Management">
      {/* Notification banner */}
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

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by device name, ID, or employee…"
              prefix={<Search size={18} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="blocked">Blocked</option>
          </select>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("");
              fetchDevices();
            }}
          >
            <Filter size={18} /> Clear
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => fetchDevices()}
          >
            <RefreshCw size={18} /> Refresh
          </Button>
        </div>
      </Card>

      {/* Error state */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Devices Table */}
      <Card title="Connected Devices" subtitle="Manage device camera access">
        {loading ? (
          <div className="py-12 text-center text-gray-400">
            Loading devices…
          </div>
        ) : devices.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            No devices found
          </div>
        ) : (
          <Table columns={deviceColumns} data={devices} />
        )}
      </Card>

      {/* Action Confirmation Modal */}
      <Modal
        isOpen={showActionModal}
        onClose={closeActionModal}
        title={actionType === "block" ? "Block Camera" : "Unblock Camera"}
        size="md"
      >
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Device:</strong>{" "}
              {selectedDevice?.deviceName ??
                selectedDevice?.deviceIdentifier ??
                "—"}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Device ID:</strong>{" "}
              {selectedDevice?.deviceIdentifier ?? "—"}
            </p>
          </div>

          <p className="text-gray-700">
            Are you sure you want to{" "}
            <strong>{actionType === "block" ? "block" : "unblock"}</strong> the
            camera on this device?
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Reason <span className="text-gray-400">(optional)</span>
            </label>
            <Input
              placeholder="E.g. Policy violation, Employee request…"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          {actionType === "block" && (
            <p className="text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
              ⚠️ The device camera will be blocked immediately. This action is
              logged in the audit trail.
            </p>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            variant="secondary"
            onClick={closeActionModal}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button
            variant={actionType === "block" ? "danger" : "success"}
            onClick={handleConfirmAction}
            isLoading={actionLoading}
          >
            {actionType === "block" ? "Block Camera" : "Unblock Camera"}
          </Button>
        </div>
      </Modal>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <div className="text-center">
            <Shield size={32} className="text-blue-600 mx-auto mb-2" />
            <p className="text-gray-600 text-sm mb-2">Total Devices</p>
            <p className="text-3xl font-bold">{devices.length}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <Lock size={32} className="text-red-600 mx-auto mb-2" />
            <p className="text-gray-600 text-sm mb-2">Blocked Cameras</p>
            <p className="text-3xl font-bold text-red-600">{blockedCount}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <Unlock size={32} className="text-green-600 mx-auto mb-2" />
            <p className="text-gray-600 text-sm mb-2">Active Cameras</p>
            <p className="text-3xl font-bold text-green-600">
              {unblockedCount}
            </p>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}

export default DeviceManagement;
