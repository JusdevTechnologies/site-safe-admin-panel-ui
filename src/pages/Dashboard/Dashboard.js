/**
 * Dashboard Page
 * Displays system statistics and recent activities
 */
import { useState } from 'react';
import { Activity, Smartphone, Camera, Wifi } from 'lucide-react';
import { MainLayout } from '../../components/Layout';
import { StatCard, Card, Table, Badge } from '../../components/Common';
import { formatDateTime } from '../../utils/helpers';

function Dashboard() {
  const [stats] = useState({
    activeDevices: 156,
    blockedDevices: 28,
    unblockedDevices: 124,
    inactiveDevices: 12,
  });

  const [activities] = useState([
    {
      id: 1,
      device: 'Samsung Galaxy S21',
      deviceId: 'DEV-001',
      action: 'Camera Blocked',
      user: 'John Doe',
      timestamp: new Date(Date.now() - 5 * 60000),
      status: 'success',
    },
    {
      id: 2,
      device: 'Samsung Galaxy A12',
      deviceId: 'DEV-002',
      action: 'Device Punch-in',
      user: 'Jane Smith',
      timestamp: new Date(Date.now() - 15 * 60000),
      status: 'success',
    },
    {
      id: 3,
      device: 'Samsung Galaxy M31',
      deviceId: 'DEV-003',
      action: 'Camera Unblocked',
      user: 'Admin',
      timestamp: new Date(Date.now() - 30 * 60000),
      status: 'success',
    },
    {
      id: 4,
      device: 'Samsung Galaxy Z Fold',
      deviceId: 'DEV-004',
      action: 'Device Punch-out',
      user: 'John Doe',
      timestamp: new Date(Date.now() - 45 * 60000),
      status: 'success',
    },
    {
      id: 5,
      device: 'Samsung Galaxy A52',
      deviceId: 'DEV-005',
      action: 'Camera Blocked',
      user: 'Jane Smith',
      timestamp: new Date(Date.now() - 60 * 60000),
      status: 'success',
    },
  ]);

  const activityColumns = [
    { key: 'device', label: 'Device Name' },
    { key: 'deviceId', label: 'Device ID' },
    { key: 'action', label: 'Action' },
    { key: 'user', label: 'User' },
    {
      key: 'timestamp',
      label: 'Time',
      render: (row) => formatDateTime(row.timestamp),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <Badge variant="success">{row.status}</Badge>,
    },
  ];

  return (
    <MainLayout title="Dashboard">
      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Wifi}
          label="Active Devices"
          value={stats.activeDevices}
          trend="+12%"
          trendUp={true}
        />
        <StatCard
          icon={Camera}
          label="Camera Blocked"
          value={stats.blockedDevices}
          trend="+8%"
          trendUp={true}
        />
        <StatCard
          icon={Smartphone}
          label="Camera Unblocked"
          value={stats.unblockedDevices}
          trend="-5%"
          trendUp={false}
        />
        <StatCard
          icon={Activity}
          label="Inactive Devices"
          value={stats.inactiveDevices}
          trend="-2%"
          trendUp={false}
        />
      </div>

      {/* Recent Activities */}
      <Card
        title="Recent Activities"
        subtitle="Latest device status updates and activities"
        className="mt-8"
      >
        <Table columns={activityColumns} data={activities} />
      </Card>

      {/* Quick Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <Card title="Device Status Overview" className="lg:col-span-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <span className="font-medium text-gray-900">Total Connected Devices</span>
              <span className="text-3xl font-bold text-blue-800">{stats.activeDevices}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <span className="font-medium text-gray-900">Cameras Unblocked</span>
              <span className="text-3xl font-bold text-green-600">{stats.unblockedDevices}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <span className="font-medium text-gray-900">Cameras Blocked</span>
              <span className="text-3xl font-bold text-red-600">{stats.blockedDevices}</span>
            </div>
          </div>
        </Card>

        <Card title="System Status">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Server Status</span>
              <Badge variant="success">Operational</Badge>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">API Status</span>
              <Badge variant="success">Healthy</Badge>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Database</span>
              <Badge variant="success">Connected</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Last Updated</span>
              <span className="text-gray-900 font-medium">Just now</span>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}

export default Dashboard;
