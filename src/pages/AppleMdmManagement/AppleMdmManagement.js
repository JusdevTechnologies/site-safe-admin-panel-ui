import { useState, useEffect, useCallback } from "react";
import {
  Smartphone,
  Wifi,
  WifiOff,
  CameraOff,
  Clock,
  RefreshCw,
  Cloud,
  X,
  Ban,
  CheckCircle,
  RotateCw,
  List,
  ChevronRight
} from "lucide-react";
import { MainLayout } from "../../components/Layout";
import {
  Card,
  Table,
  Badge,
  Button,
  Input,
  Modal,
  Drawer,
  StatCard
} from "../../components/Common";
import { formatDateTime } from "../../utils/helpers";
import useAppleMdm from "../../hooks/useAppleMdm";

const ENROLLMENT_STATUS_MAP = {
  enrolled: { label: "Enrolled", variant: "success" },
  pending: { label: "Pending", variant: "warning" },
  removed: { label: "Removed", variant: "danger" }
};

const CAMERA_STATUS_MAP = {
  enabled: { label: "Enabled", variant: "success" },
  disabled: { label: "Disabled", variant: "danger" },
  unknown: { label: "Unknown", variant: "secondary" }
};

const COMMAND_STATUS_MAP = {
  queued: { label: "Queued", variant: "warning" },
  sent: { label: "Sent", variant: "info" },
  acknowledged: { label: "Acknowledged", variant: "success" },
  completed: { label: "Completed", variant: "success" },
  error: { label: "Error", variant: "danger" },
  failed: { label: "Failed", variant: "danger" }
};

function AppleMdmManagement() {
  const {
    devices,
    loading,
    error,
    actionLoading,
    fetchDevices,
    disableCamera,
    enableCamera,
    refreshDevice,
    syncDevices,
    fetchCommands
  } = useAppleMdm();

  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerTab, setDrawerTab] = useState("details");
  const [deviceCommands, setDeviceCommands] = useState([]);
  const [commandsLoading, setCommandsLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [lastSynced, setLastSynced] = useState(null);

  useEffect(() => {
    fetchDevices({ search: searchTerm || undefined });
  }, [searchTerm, fetchDevices]);

  useEffect(() => {
    if (!notification) return;
    const t = setTimeout(() => setNotification(null), 4000);
    return () => clearTimeout(t);
  }, [notification]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchDevices({ search: searchTerm || undefined });
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchDevices, searchTerm]);

  const openConfirmModal = (device, action) => {
    setSelectedDevice(device);
    setConfirmAction(action);
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setSelectedDevice(null);
    setConfirmAction(null);
  };

  const handleSync = async () => {
    setSyncLoading(true);
    const result = await syncDevices();
    setSyncLoading(false);

    if (result?.success) {
      setLastSynced(new Date().toISOString());
      setNotification({ type: "success", message: "Devices synced successfully" });
      fetchDevices({ search: searchTerm || undefined });
    } else {
      setNotification({ type: "error", message: result?.error || "Failed to sync devices" });
    }
  };

  const handleConfirmAction = async () => {
    if (!selectedDevice || !confirmAction) return;

    let result;
    if (confirmAction === "disable") {
      result = await disableCamera(selectedDevice.id);
    } else if (confirmAction === "enable") {
      result = await enableCamera(selectedDevice.id);
    } else if (confirmAction === "refresh") {
      result = await refreshDevice(selectedDevice.id);
    }

    closeConfirmModal();

    if (result?.success) {
      setNotification({ type: "success", message: "Operation completed successfully" });
      fetchDevices({ search: searchTerm || undefined });
    } else {
      setNotification({ type: "error", message: result?.error || "Operation failed" });
    }
  };

  const openDrawer = async (device) => {
    setSelectedDevice(device);
    setDrawerTab("details");
    setShowDrawer(true);
    setDeviceCommands([]);
  };

  const closeDrawer = () => {
    setShowDrawer(false);
    setSelectedDevice(null);
    setDeviceCommands([]);
  };

  const handleViewCommands = useCallback(async (device) => {
    if (!device) return;
    setDrawerTab("commands");
    setCommandsLoading(true);
    const result = await fetchCommands(device.id);
    if (result.success) {
      setDeviceCommands(result.commands);
    } else {
      setNotification({ type: "error", message: result.error || "Failed to load commands" });
    }
    setCommandsLoading(false);
  }, [fetchCommands]);

  useEffect(() => {
    if (showDrawer && selectedDevice && drawerTab === "commands") {
      handleViewCommands(selectedDevice);
    }
  }, [drawerTab, showDrawer, selectedDevice, handleViewCommands]);

  const stats = {
    total: devices.length,
    online: devices.filter((d) => d.enrollmentStatus === "enrolled" && (d.lastSeen ? new Date(d.lastSeen) > new Date(Date.now() - 5 * 60 * 1000) : false)).length,
    offline: devices.filter((d) => d.enrollmentStatus !== "enrolled" || (d.lastSeen ? new Date(d.lastSeen) <= new Date(Date.now() - 5 * 60 * 1000) : true)).length,
    cameraDisabled: devices.filter((d) => d.cameraStatus === "disabled").length,
    pendingCommands: devices.reduce((sum, d) => sum + (d.pendingCommands ?? 0), 0)
  };

  const deviceColumns = [
    {
      key: "deviceName",
      label: "Device Name",
      render: (row) => (
        <button
          onClick={() => openDrawer(row)}
          className="text-blue-700 hover:text-blue-900 font-medium hover:underline text-left flex items-center gap-1"
        >
          {row.deviceName ?? row.udid?.slice(0, 8) ?? "—"}
          <ChevronRight size={14} className="text-blue-400" />
        </button>
      )
    },
    {
      key: "serialNumber",
      label: "Serial Number",
      render: (row) => row.serialNumber ?? row.serial_number ?? "—"
    },
    {
      key: "model",
      label: "Model",
      render: (row) => row.model ?? "—"
    },
    {
      key: "osVersion",
      label: "iOS Version",
      render: (row) => row.osVersion ?? row.os_version ?? "—"
    },
    {
      key: "enrollmentStatus",
      label: "Enrollment Status",
      render: (row) => {
        const status = row.enrollmentStatus ?? row.enrollment_status ?? "unknown";
        const map = ENROLLMENT_STATUS_MAP[status?.toLowerCase()] || ENROLLMENT_STATUS_MAP.pending;
        return <Badge variant={map.variant}>{map.label}</Badge>;
      }
    },
    {
      key: "cameraStatus",
      label: "Camera Status",
      render: (row) => {
        const status = row.cameraStatus ?? row.camera_status ?? "unknown";
        const map = CAMERA_STATUS_MAP[status?.toLowerCase()] || CAMERA_STATUS_MAP.unknown;
        return <Badge variant={map.variant}>{map.label}</Badge>;
      }
    },
    {
      key: "lastSeen",
      label: "Last Seen",
      render: (row) => {
        const lastSeen = row.lastSeen ?? row.last_seen;
        return lastSeen ? formatDateTime(lastSeen) : "—";
      }
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => {
        const isCameraDisabled = (row.cameraStatus ?? row.camera_status ?? "").toLowerCase() === "disabled";
        return (
          <div className="flex gap-1.5 flex-wrap">
            {isCameraDisabled ? (
              <Button
                variant="success"
                size="sm"
                className="text-xs gap-1"
                disabled={actionLoading}
                onClick={() => openConfirmModal(row, "enable")}
              >
                <CheckCircle size={14} /> Enable
              </Button>
            ) : (
              <Button
                variant="danger"
                size="sm"
                className="text-xs gap-1"
                disabled={actionLoading}
                onClick={() => openConfirmModal(row, "disable")}
              >
                <Ban size={14} /> Disable
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1"
              disabled={actionLoading}
              onClick={() => openConfirmModal(row, "refresh")}
            >
              <RotateCw size={14} /> Refresh
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="text-xs gap-1"
              onClick={() => {
                setSelectedDevice(row);
                setShowDrawer(true);
                setDrawerTab("commands");
                setDeviceCommands([]);
              }}
            >
              <List size={14} /> Commands
            </Button>
          </div>
        );
      }
    }
  ];

  const commandColumns = [
    { key: "commandUuid", label: "Command UUID", render: (row) => row.commandUuid ?? row.command_uuid ?? "—" },
    { key: "commandType", label: "Type", render: (row) => row.commandType ?? row.command_type ?? "—" },
    {
      key: "queuedAt",
      label: "Queued",
      render: (row) => row.queuedAt ?? row.queued_at ? formatDateTime(row.queuedAt ?? row.queued_at) : "—"
    },
    {
      key: "acknowledgedAt",
      label: "Acknowledged",
      render: (row) => row.acknowledgedAt ?? row.acknowledged_at ? formatDateTime(row.acknowledgedAt ?? row.acknowledged_at) : "—"
    },
    {
      key: "completedAt",
      label: "Completed",
      render: (row) => row.completedAt ?? row.completed_at ? formatDateTime(row.completedAt ?? row.completed_at) : "—"
    },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const s = row.status ?? "queued";
        const map = COMMAND_STATUS_MAP[s?.toLowerCase()] || { label: s, variant: "secondary" };
        return <Badge variant={map.variant}>{map.label}</Badge>;
      }
    },
    {
      key: "errorMessage",
      label: "Error",
      render: (row) => {
        const err = row.errorMessage ?? row.error_message;
        return err ? <span className="text-red-600 text-sm">{err}</span> : "—";
      }
    },
    {
      key: "timestamp",
      label: "Timestamp",
      render: (row) => row.timestamp ?? row.createdAt ?? row.created_at ? formatDateTime(row.timestamp ?? row.createdAt ?? row.created_at) : "—"
    }
  ];

  return (
    <MainLayout title="Apple MDM Devices">
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
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center justify-between">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={() => fetchDevices()}>
            <RefreshCw size={14} /> Retry
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <StatCard icon={Smartphone} label="Total Devices" value={stats.total} />
        <StatCard icon={Wifi} label="Online Devices" value={stats.online} />
        <StatCard icon={WifiOff} label="Offline Devices" value={stats.offline} />
        <StatCard icon={CameraOff} label="Camera Disabled" value={stats.cameraDisabled} />
        <StatCard icon={Clock} label="Pending Commands" value={stats.pendingCommands} />
      </div>

      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex-1 w-full">
            <Input
              placeholder="Search by device name or serial number…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            {lastSynced && (
              <span className="text-xs text-gray-400 hidden lg:flex items-center gap-1 shrink-0">
                <Clock size={12} />
                Last synced: {formatDateTime(lastSynced)}
              </span>
            )}
            <Button
              variant="outline"
              className="gap-2 shrink-0"
              onClick={handleSync}
              isLoading={syncLoading}
              disabled={actionLoading}
            >
              <Cloud size={18} /> Sync
            </Button>
            <Button
              variant="outline"
              className="gap-2 shrink-0"
              onClick={() => fetchDevices()}
              disabled={actionLoading || syncLoading}
            >
              <RefreshCw size={18} /> Refresh
            </Button>
          </div>
        </div>
      </Card>

      <Card
        title="Apple MDM Devices"
        subtitle={
          lastSynced
            ? `Manage Apple devices enrolled via MDM · Last synced ${formatDateTime(lastSynced)}`
            : "Manage Apple devices enrolled via MDM"
        }
      >
        {loading ? (
          <div className="py-12 text-center text-gray-400">
            <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-800 rounded-full animate-spin mx-auto mb-3" />
            Loading devices…
          </div>
        ) : devices.length === 0 ? (
          <div className="py-12 text-center text-gray-400">No Apple MDM devices found</div>
        ) : (
          <Table columns={deviceColumns} data={devices} />
        )}
      </Card>

      <Modal
        isOpen={showConfirmModal}
        onClose={closeConfirmModal}
        title={
          confirmAction === "disable"
            ? "Disable Camera"
            : confirmAction === "enable"
            ? "Enable Camera"
            : "Refresh Device Status"
        }
        size="md"
      >
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Device:</strong> {selectedDevice?.deviceName ?? selectedDevice?.udid ?? "—"}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Serial:</strong> {selectedDevice?.serialNumber ?? selectedDevice?.serial_number ?? "—"}
            </p>
          </div>

          {confirmAction === "disable" && (
            <>
              <p className="text-gray-700">
                Are you sure you want to <strong>disable the camera</strong> on this device?
              </p>
              <p className="text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
                The camera will be disabled via MDM command. The device must be online to receive the command.
              </p>
            </>
          )}

          {confirmAction === "enable" && (
            <>
              <p className="text-gray-700">
                Are you sure you want to <strong>enable the camera</strong> on this device?
              </p>
              <p className="text-sm text-green-700 bg-green-50 p-3 rounded-lg">
                The camera will be enabled via MDM command. The device must be online to receive the command.
              </p>
            </>
          )}

          {confirmAction === "refresh" && (
            <>
              <p className="text-gray-700">
                This will <strong>refresh the device status</strong> from the MDM server.
              </p>
              <p className="text-sm text-blue-700 bg-blue-50 p-3 rounded-lg">
                The latest device information and camera state will be fetched.
              </p>
            </>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="secondary" onClick={closeConfirmModal} disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            variant={confirmAction === "disable" ? "danger" : confirmAction === "enable" ? "success" : "primary"}
            onClick={handleConfirmAction}
            isLoading={actionLoading}
          >
            {confirmAction === "disable"
              ? "Disable Camera"
              : confirmAction === "enable"
              ? "Enable Camera"
              : "Refresh Status"}
          </Button>
        </div>
      </Modal>

      <Drawer
        isOpen={showDrawer}
        onClose={closeDrawer}
        title={selectedDevice?.deviceName ?? "Device Details"}
        size="lg"
      >
        {selectedDevice && (
          <div className="space-y-6">
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setDrawerTab("details")}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  drawerTab === "details"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setDrawerTab("commands")}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  drawerTab === "commands"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Commands
              </button>
            </div>

            {drawerTab === "details" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 font-medium">UDID</p>
                    <p className="text-sm text-gray-900 mt-1 break-all">
                      {selectedDevice.udid ?? "—"}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 font-medium">Serial Number</p>
                    <p className="text-sm text-gray-900 mt-1">
                      {selectedDevice.serialNumber ?? selectedDevice.serial_number ?? "—"}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 font-medium">Enrollment Date</p>
                    <p className="text-sm text-gray-900 mt-1">
                      {selectedDevice.enrollmentDate ?? selectedDevice.enrollment_date
                        ? formatDateTime(selectedDevice.enrollmentDate ?? selectedDevice.enrollment_date)
                        : "—"}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 font-medium">Model</p>
                    <p className="text-sm text-gray-900 mt-1">
                      {selectedDevice.model ?? "—"}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 font-medium">OS Version</p>
                    <p className="text-sm text-gray-900 mt-1">
                      {selectedDevice.osVersion ?? selectedDevice.os_version ?? "—"}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 font-medium">Battery</p>
                    <p className="text-sm text-gray-900 mt-1">
                      {selectedDevice.batteryLevel ?? selectedDevice.battery_level != null
                        ? `${selectedDevice.batteryLevel ?? selectedDevice.battery_level}%`
                        : "—"}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 font-medium">Camera State</p>
                    <p className="text-sm text-gray-900 mt-1">
                      {(selectedDevice.cameraStatus ?? selectedDevice.camera_status ?? "unknown").toLowerCase() === "disabled" ? (
                        <Badge variant="danger">Disabled</Badge>
                      ) : (
                        <Badge variant="success">Enabled</Badge>
                      )}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 font-medium">Enrollment Status</p>
                    <p className="text-sm text-gray-900 mt-1">
                      {(() => {
                        const s = selectedDevice.enrollmentStatus ?? selectedDevice.enrollment_status ?? "unknown";
                        const map = ENROLLMENT_STATUS_MAP[s?.toLowerCase()] || { label: s, variant: "secondary" };
                        return <Badge variant={map.variant}>{map.label}</Badge>;
                      })()}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 font-medium">Pending Commands</p>
                  <p className="text-sm text-gray-900 mt-1">
                    {selectedDevice.pendingCommands ?? selectedDevice.pending_commands ?? 0}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 font-medium">Completed Commands</p>
                  <p className="text-sm text-gray-900 mt-1">
                    {selectedDevice.completedCommands ?? selectedDevice.completed_commands ?? 0}
                  </p>
                </div>
              </div>
            )}

            {drawerTab === "commands" && (
              <div>
                {commandsLoading ? (
                  <div className="py-12 text-center text-gray-400">
                    <div className="w-6 h-6 border-3 border-blue-200 border-t-blue-800 rounded-full animate-spin mx-auto mb-2" />
                    Loading commands…
                  </div>
                ) : deviceCommands.length === 0 ? (
                  <div className="py-12 text-center text-gray-400">No commands found for this device</div>
                ) : (
                  <div className="w-full overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          {commandColumns.map((col) => (
                            <th
                              key={col.key}
                              className="px-3 py-2.5 text-left text-xs font-semibold text-gray-900"
                            >
                              {col.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {deviceCommands.map((cmd, idx) => (
                          <tr
                            key={idx}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                          >
                            {commandColumns.map((col) => (
                              <td
                                key={`${idx}-${col.key}`}
                                className="px-3 py-2.5 text-xs text-gray-900"
                              >
                                {col.render ? col.render(cmd) : cmd[col.key]}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Drawer>
    </MainLayout>
  );
}

export default AppleMdmManagement;
