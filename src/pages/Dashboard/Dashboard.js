/**
 * Dashboard Page
 * Displays live device statistics and recent device management history
 * sourced from the backend API.
 */
import { Activity, Smartphone, Camera, Shield, RefreshCw } from "lucide-react";
import { MainLayout } from "../../components/Layout";
import { StatCard, Card, Table, Badge, Button } from "../../components/Common";
import { formatDateTime } from "../../utils/helpers";
import useDashboard from "../../hooks/useDashboard";

function Dashboard() {
  const { stats, deviceHistory, otpSummary, loading, error, refetch } =
    useDashboard();

  // ─── Derived stat values with safe fallbacks ─────────────────────────────
  const totalDevices = stats?.devices?.total ?? 0;
  const activeDevices = stats?.devices?.active ?? 0;
  const blockedDevices = stats?.camera?.blocked ?? 0;
  const inactiveDevices = stats?.devices?.inactive ?? 0;

  // ─── Device history table columns ────────────────────────────────────────
  const historyColumns = [
    {
      key: "device_name",
      label: "Device Name",
      render: (row) => row.device_name ?? row.device?.name ?? "—"
    },
    {
      key: "device_identifier",
      label: "Device ID",
      render: (row) => row.device_identifier ?? row.device?.identifier ?? "—"
    },
    {
      key: "action_type",
      label: "Action",
      render: (row) => row.action_type ?? row.action ?? "—"
    },
    {
      key: "performed_by",
      label: "Admin",
      render: (row) =>
        row.performed_by?.username ??
        row.admin?.username ??
        row.performed_by ??
        "—"
    },
    {
      key: "created_at",
      label: "Time",
      render: (row) => formatDateTime(row.created_at ?? row.timestamp)
    },
    {
      key: "status",
      label: "Status",
      render: (row) =>
        row.status ? (
          <Badge variant={row.status === "success" ? "success" : "default"}>
            {row.status}
          </Badge>
        ) : null
    }
  ];

  return (
    <MainLayout title="Dashboard">
      {/* Error banner */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <p className="text-red-700 text-sm">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={refetch}
            className="gap-2 ml-4 shrink-0"
          >
            <RefreshCw size={14} /> Retry
          </Button>
        </div>
      )}

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Smartphone}
          label="Total Devices"
          value={loading ? "—" : totalDevices}
        />
        <StatCard
          icon={Activity}
          label="Active Devices"
          value={loading ? "—" : activeDevices}
        />
        <StatCard
          icon={Camera}
          label="Camera Blocked"
          value={loading ? "—" : blockedDevices}
        />
        <StatCard
          icon={Shield}
          label="Inactive Devices"
          value={loading ? "—" : inactiveDevices}
        />
      </div>

      {/* Recent Device Management History */}
      <Card
        title="Recent Device Management Activity"
        subtitle="Audit trail of camera block / unblock operations"
        className="mt-8"
      >
        {loading ? (
          <div className="py-12 text-center text-gray-400">
            Loading activities…
          </div>
        ) : deviceHistory.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            No recent activity
          </div>
        ) : (
          <Table columns={historyColumns} data={deviceHistory} />
        )}
      </Card>

      {/* Quick Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <Card title="Device Status Overview" className="lg:col-span-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <span className="font-medium text-gray-900">
                Total Registered Devices
              </span>
              <span className="text-3xl font-bold text-blue-800">
                {loading ? "—" : totalDevices}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <span className="font-medium text-gray-900">Active Devices</span>
              <span className="text-3xl font-bold text-green-600">
                {loading ? "—" : activeDevices}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <span className="font-medium text-gray-900">Cameras Blocked</span>
              <span className="text-3xl font-bold text-red-600">
                {loading ? "—" : blockedDevices}
              </span>
            </div>
          </div>
        </Card>

        <Card title="OTP Summary">
          {otpSummary ? (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">Total Generated</span>
                <span className="font-semibold">
                  {otpSummary.total_generated ?? otpSummary.total ?? "—"}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">Used</span>
                <Badge variant="success">{otpSummary.used ?? "—"}</Badge>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">Pending</span>
                <Badge variant="warning">{otpSummary.pending ?? "—"}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Expired</span>
                <Badge variant="danger">{otpSummary.expired ?? "—"}</Badge>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">Server Status</span>
                <Badge variant="success">Operational</Badge>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-gray-600">API Status</span>
                <Badge variant={error ? "danger" : "success"}>
                  {error ? "Error" : "Healthy"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Database</span>
                <Badge variant="success">Connected</Badge>
              </div>
            </div>
          )}
        </Card>
      </div>
    </MainLayout>
  );
}

export default Dashboard;
