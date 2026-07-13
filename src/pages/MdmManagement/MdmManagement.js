import { useState, useEffect } from "react";
import {
  Monitor,
  FileJson,
  Terminal,
  Search,
  Filter,
  RefreshCw,
  Download,
  Trash2,
  X,
  AlertTriangle
} from "lucide-react";
import { MainLayout } from "../../components/Layout";
import { Card, Table, Badge, Button, Input, Modal } from "../../components/Common";
import { formatDateTime } from "../../utils/helpers";
import useMdm from "../../hooks/useMdm";

const TABS = [
  { id: "devices", label: "MDM Devices", icon: Monitor },
  { id: "profiles", label: "Profiles", icon: FileJson },
  { id: "commands", label: "Commands", icon: Terminal }
];

const COMMAND_STATUS_MAP = {
  queued: { label: "Queued", variant: "warning" },
  sent: { label: "Sent", variant: "info" },
  acknowledged: { label: "Acknowledged", variant: "success" },
  failed: { label: "Failed", variant: "danger" }
};

function MdmManagement() {
  const [activeTab, setActiveTab] = useState("devices");
  const {
    devices, profiles, commands, loading, error, actionLoading,
    fetchDevices, fetchProfiles, fetchCommands, installProfile, removeProfile
  } = useMdm();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [commandTypeFilter, setCommandTypeFilter] = useState("");
  const [notification, setNotification] = useState(null);

  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  useEffect(() => {
    if (activeTab === "devices") fetchDevices({ search: searchTerm || undefined });
    else if (activeTab === "profiles") fetchProfiles();
    else if (activeTab === "commands") {
      fetchCommands({
        search: searchTerm || undefined,
        status: statusFilter || undefined,
        commandType: commandTypeFilter || undefined
      });
    }
  }, [activeTab, fetchDevices, fetchProfiles, fetchCommands, searchTerm, statusFilter, commandTypeFilter]);

  useEffect(() => {
    if (!notification) return;
    const t = setTimeout(() => setNotification(null), 4000);
    return () => clearTimeout(t);
  }, [notification]);

  const openInstallModal = (device) => {
    setSelectedDevice(device);
    setShowInstallModal(true);
  };

  const closeInstallModal = () => {
    setShowInstallModal(false);
    setSelectedDevice(null);
  };

  const openRemoveModal = (device) => {
    setSelectedDevice(device);
    setShowRemoveModal(true);
  };

  const closeRemoveModal = () => {
    setShowRemoveModal(false);
    setSelectedDevice(null);
  };

  const handleInstallProfile = async () => {
    if (!selectedDevice) return;
    const result = await installProfile(
      selectedDevice.udid,
      {
        PayloadIdentifier: "com.sitesafe.camera.restriction",
        PayloadType: "Configuration",
        PayloadDisplayName: "Camera Restriction Policy",
        PayloadDescription: "Restricts device camera access",
        PayloadOrganization: "SiteSafe",
        PayloadContent: [
          {
            PayloadType: "com.apple.applicationaccess",
            PayloadIdentifier: "com.sitesafe.camera.restriction.policy",
            PayloadUUID: crypto.randomUUID?.() || "policy-" + Date.now(),
            PayloadVersion: 1,
            PayloadContent: { allowCamera: false }
          }
        ]
      }
    );
    closeInstallModal();
    setNotification(
      result.success
        ? { type: "success", message: "Profile install command sent successfully" }
        : { type: "error", message: result.error }
    );
  };

  const handleRemoveProfile = async () => {
    if (!selectedDevice) return;
    const result = await removeProfile(selectedDevice.udid, "com.sitesafe.camera.restriction");
    closeRemoveModal();
    setNotification(
      result.success
        ? { type: "success", message: "Profile removal command sent successfully" }
        : { type: "error", message: result.error }
    );
  };

  const deviceColumns = [
    { key: "device_name", label: "Device Name", render: (row) => row.device_name ?? row.udid?.slice(0, 8) ?? "—" },
    { key: "serial_number", label: "Serial", render: (row) => row.serial_number ?? "—" },
    { key: "platform", label: "Platform", render: (row) => row.platform ?? (row.os_version ? "ios" : "—") },
    { key: "os_version", label: "OS Version", render: (row) => row.os_version ?? "—" },
    { key: "model", label: "Model", render: (row) => row.model ?? "—" },
    {
      key: "supervised",
      label: "Supervised",
      render: (row) => row.supervised ? <Badge variant="success">Yes</Badge> : <Badge variant="secondary">No</Badge>
    },
    {
      key: "last_seen",
      label: "Last Seen",
      render: (row) => row.last_seen ? formatDateTime(row.last_seen) : "—"
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <Button variant="primary" size="sm" className="text-xs gap-1" disabled={actionLoading} onClick={() => openInstallModal(row)}>
            <Download size={14} /> Install
          </Button>
          <Button variant="danger" size="sm" className="text-xs gap-1" disabled={actionLoading} onClick={() => openRemoveModal(row)}>
            <Trash2 size={14} /> Remove
          </Button>
        </div>
      )
    }
  ];

  const profileColumns = [
    { key: "identifier", label: "Identifier", render: (row) => row.identifier ?? row.PayloadIdentifier ?? "—" },
    { key: "display_name", label: "Display Name", render: (row) => row.display_name ?? row.PayloadDisplayName ?? "—" },
    { key: "description", label: "Description", render: (row) => row.description ?? row.PayloadDescription ?? "—" },
    { key: "version", label: "Version", render: (row) => row.version ?? row.PayloadVersion ?? 1 },
    { key: "organization", label: "Organization", render: (row) => row.organization ?? row.PayloadOrganization ?? "—" }
  ];

  const getCommandStatusBadge = (status) => {
    const map = COMMAND_STATUS_MAP[status?.toLowerCase()];
    return map ? <Badge variant={map.variant}>{map.label}</Badge> : <Badge>{status}</Badge>;
  };

  const commandColumns = [
    { key: "commandUuid", label: "Command UUID", render: (row) => row.commandUuid?.slice(0, 12) + "…" ?? "—" },
    { key: "commandType", label: "Type", render: (row) => row.commandType ?? "—" },
    { key: "deviceIdentifier", label: "Device UDID", render: (row) => row.deviceIdentifier?.slice(0, 12) + "…" ?? "—" },
    { key: "status", label: "Status", render: (row) => getCommandStatusBadge(row.status) },
    {
      key: "queuedAt",
      label: "Queued",
      render: (row) => row.queuedAt ? formatDateTime(row.queuedAt) : "—"
    },
    {
      key: "acknowledgedAt",
      label: "Acknowledged",
      render: (row) => row.acknowledgedAt ? formatDateTime(row.acknowledgedAt) : "—"
    },
    {
      key: "errorMessage",
      label: "Error",
      render: (row) => row.errorMessage ? <span className="text-red-600 text-sm">{row.errorMessage}</span> : "—"
    }
  ];

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="py-16 text-center text-gray-400">
          <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-800 rounded-full animate-spin mx-auto mb-3" />
          Loading {TABS.find(t => t.id === activeTab)?.label?.toLowerCase() ?? "data"}…
        </div>
      );
    }

    if (activeTab === "devices") {
      return (
        <Card title="NanoMDM Devices" subtitle="Devices enrolled in MDM server">
          {devices.length === 0 ? (
            <div className="py-12 text-center text-gray-400">No MDM devices found</div>
          ) : (
            <Table columns={deviceColumns} data={devices} />
          )}
        </Card>
      );
    }

    if (activeTab === "profiles") {
      return (
        <Card title="Configuration Profiles" subtitle="Profiles available in NanoMDM">
          {profiles.length === 0 ? (
            <div className="py-12 text-center text-gray-400">No profiles found</div>
          ) : (
            <Table columns={profileColumns} data={profiles} />
          )}
        </Card>
      );
    }

    if (activeTab === "commands") {
      return (
        <Card title="MDM Commands" subtitle="Track profile install/remove operations">
          {commands.length === 0 ? (
            <div className="py-12 text-center text-gray-400">No commands found</div>
          ) : (
            <Table columns={commandColumns} data={commands} />
          )}
        </Card>
      );
    }

    return null;
  };

  return (
    <MainLayout title="MDM Management">
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
          <Button variant="outline" size="sm" onClick={() => {
            if (activeTab === "devices") fetchDevices();
            else if (activeTab === "profiles") fetchProfiles();
            else fetchCommands();
          }}>
            <RefreshCw size={14} /> Retry
          </Button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSearchTerm(""); setStatusFilter(""); setCommandTypeFilter(""); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-blue-800 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Filters - shown for devices and commands tabs */}
      {(activeTab === "devices" || activeTab === "commands") && (
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {activeTab === "devices" && (
              <div className="flex-1">
                <Input
                  placeholder="Search devices by name or serial…"
                  prefix={<Search size={18} />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            )}
            {activeTab === "commands" && (
              <>
                <div className="flex-1">
                  <Input
                    placeholder="Search by command UUID or device UDID…"
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
                  <option value="queued">Queued</option>
                  <option value="sent">Sent</option>
                  <option value="acknowledged">Acknowledged</option>
                  <option value="failed">Failed</option>
                </select>
                <select
                  value={commandTypeFilter}
                  onChange={(e) => setCommandTypeFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">All Types</option>
                  <option value="InstallProfile">InstallProfile</option>
                  <option value="RemoveProfile">RemoveProfile</option>
                  <option value="DeviceInformation">DeviceInformation</option>
                </select>
              </>
            )}
            <Button variant="outline" className="gap-2" onClick={() => {
              setSearchTerm("");
              setStatusFilter("");
              setCommandTypeFilter("");
              if (activeTab === "devices") fetchDevices();
              else fetchCommands();
            }}>
              <Filter size={18} /> Clear
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => {
              if (activeTab === "devices") fetchDevices();
              else fetchCommands();
            }}>
              <RefreshCw size={18} /> Refresh
            </Button>
          </div>
        </Card>
      )}

      {renderTabContent()}

      {/* Install Profile Modal */}
      <Modal isOpen={showInstallModal} onClose={closeInstallModal} title="Install Profile" size="lg">
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700"><strong>Device:</strong> {selectedDevice?.device_name ?? "—"}</p>
            <p className="text-sm text-gray-700"><strong>UDID:</strong> {selectedDevice?.udid ?? "—"}</p>
            <p className="text-sm text-gray-700"><strong>Model:</strong> {selectedDevice?.model ?? "—"}</p>
          </div>
          <p className="text-gray-700">
            This will install the <strong>Camera Restriction Policy</strong> profile on the device via NanoMDM.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-1 font-mono text-gray-600">
            <p>Profile: Camera Restriction Policy</p>
            <p>Identifier: com.sitesafe.camera.restriction</p>
            <p>Action: Disable Camera</p>
          </div>
          <p className="text-sm text-amber-700 bg-amber-50 p-3 rounded-lg flex items-start gap-2">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            The profile will be pushed to the device immediately. The device must be online to receive the command.
          </p>
        </div>
        <div className="flex gap-3 mt-6">
          <Button variant="secondary" onClick={closeInstallModal} disabled={actionLoading}>Cancel</Button>
          <Button variant="primary" onClick={handleInstallProfile} isLoading={actionLoading}>
            <Download size={16} /> Install Profile
          </Button>
        </div>
      </Modal>

      {/* Remove Profile Modal */}
      <Modal isOpen={showRemoveModal} onClose={closeRemoveModal} title="Remove Profile" size="lg">
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700"><strong>Device:</strong> {selectedDevice?.device_name ?? "—"}</p>
            <p className="text-sm text-gray-700"><strong>UDID:</strong> {selectedDevice?.udid ?? "—"}</p>
          </div>
          <p className="text-gray-700">
            This will remove the <strong>Camera Restriction Policy</strong> profile from the device. The camera will be re-enabled.
          </p>
          <p className="text-sm text-amber-700 bg-amber-50 p-3 rounded-lg flex items-start gap-2">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            The device camera will be unblocked once the profile is removed. This action is logged in the audit trail.
          </p>
        </div>
        <div className="flex gap-3 mt-6">
          <Button variant="secondary" onClick={closeRemoveModal} disabled={actionLoading}>Cancel</Button>
          <Button variant="danger" onClick={handleRemoveProfile} isLoading={actionLoading}>
            <Trash2 size={16} /> Remove Profile
          </Button>
        </div>
      </Modal>
    </MainLayout>
  );
}

export default MdmManagement;
