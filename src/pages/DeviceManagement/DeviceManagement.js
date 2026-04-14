/**
 * Device Management Page
 * Display devices and allow blocking/unblocking camera
 */
import { useState } from 'react';
import { Shield, Lock, Unlock, Search, Filter } from 'lucide-react';
import { MainLayout } from '../../components/Layout';
import { Card, Table, Badge, Button, Input, Modal } from '../../components/Common';
import { formatDateTime, formatDeviceStatus } from '../../utils/helpers';

function DeviceManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState(null);

  const [devices, setDevices] = useState([
    {
      id: 1,
      deviceName: 'Samsung Galaxy S21',
      deviceId: 'DEV-001',
      model: 'SM-G991N',
      cameraStatus: 'blocked',
      lastActive: new Date(Date.now() - 5 * 60000),
      osVersion: 'Android 14',
      user: 'John Doe',
    },
    {
      id: 2,
      deviceName: 'Samsung Galaxy A12',
      deviceId: 'DEV-002',
      model: 'SM-A125F',
      cameraStatus: 'unblocked',
      lastActive: new Date(Date.now() - 15 * 60000),
      osVersion: 'Android 12',
      user: 'Jane Smith',
    },
    {
      id: 3,
      deviceName: 'Samsung Galaxy M31',
      deviceId: 'DEV-003',
      model: 'SM-M315F',
      cameraStatus: 'blocked',
      lastActive: new Date(Date.now() - 30 * 60000),
      osVersion: 'Android 11',
      user: 'Mike Johnson',
    },
    {
      id: 4,
      deviceName: 'Samsung Galaxy Z Fold',
      deviceId: 'DEV-004',
      model: 'SM-F916N',
      cameraStatus: 'unblocked',
      lastActive: new Date(Date.now() - 45 * 60000),
      osVersion: 'Android 14',
      user: 'Sarah Wilson',
    },
    {
      id: 5,
      deviceName: 'Samsung Galaxy A52',
      deviceId: 'DEV-005',
      model: 'SM-A525F',
      cameraStatus: 'blocked',
      lastActive: new Date(Date.now() - 60 * 60000),
      osVersion: 'Android 13',
      user: 'Tom Brown',
    },
  ]);

  const handleBlockCamera = (device) => {
    setSelectedDevice(device);
    setActionType('block');
    setShowActionModal(true);
  };

  const handleUnblockCamera = (device) => {
    setSelectedDevice(device);
    setActionType('unblock');
    setShowActionModal(true);
  };

  const handleConfirmAction = () => {
    if (selectedDevice) {
      setDevices(
        devices.map((d) =>
          d.id === selectedDevice.id
            ? {
                ...d,
                cameraStatus: actionType === 'block' ? 'blocked' : 'unblocked',
              }
            : d
        )
      );
    }
    setShowActionModal(false);
    setSelectedDevice(null);
    setActionType(null);
  };

  const filteredDevices = devices.filter((device) =>
    device.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.deviceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deviceColumns = [
    { key: 'deviceName', label: 'Device Name' },
    { key: 'deviceId', label: 'Device ID' },
    { key: 'user', label: 'User' },
    { key: 'osVersion', label: 'OS Version' },
    {
      key: 'cameraStatus',
      label: 'Camera Status',
      render: (row) => {
        const status = formatDeviceStatus(row.cameraStatus);
        return (
          <Badge
            variant={status.color === 'success' ? 'success' : 'danger'}
          >
            {status.text}
          </Badge>
        );
      },
    },
    {
      key: 'lastActive',
      label: 'Last Active',
      render: (row) => formatDateTime(row.lastActive),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          {row.cameraStatus === 'unblocked' ? (
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleBlockCamera(row)}
              className="text-xs"
            >
              <Lock size={14} />
              Block
            </Button>
          ) : (
            <Button
              variant="success"
              size="sm"
              onClick={() => handleUnblockCamera(row)}
              className="text-xs"
            >
              <Unlock size={14} />
              Unblock
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <MainLayout title="Device Management">
      {/* Filters Section */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by device name, ID, or user..."
              prefix={<Search size={18} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter size={18} />
            Filters
          </Button>
        </div>
      </Card>

      {/* Devices Table */}
      <Card title="Connected Devices" subtitle="Manage device camera access">
        <Table columns={deviceColumns} data={filteredDevices} />
      </Card>

      {/* Action Modal */}
      <Modal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        title={actionType === 'block' ? 'Block Camera' : 'Unblock Camera'}
        size="md"
      >
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Device:</strong> {selectedDevice?.deviceName}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Device ID:</strong> {selectedDevice?.deviceId}
            </p>
            <p className="text-sm text-gray-700">
              <strong>User:</strong> {selectedDevice?.user}
            </p>
          </div>

          <p className="text-gray-700">
            Are you sure you want to{' '}
            <strong>{actionType === 'block' ? 'block' : 'unblock'}</strong> the camera on this
            device?
          </p>

          {actionType === 'block' && (
            <p className="text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
              ⚠️ The device camera will be blocked immediately.
            </p>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="secondary" onClick={() => setShowActionModal(false)}>
            Cancel
          </Button>
          <Button
            variant={actionType === 'block' ? 'danger' : 'success'}
            onClick={handleConfirmAction}
          >
            {actionType === 'block' ? 'Block Camera' : 'Unblock Camera'}
          </Button>
        </div>
      </Modal>

      {/* Statistics */}
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
            <p className="text-3xl font-bold text-red-600">
              {devices.filter((d) => d.cameraStatus === 'blocked').length}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <Unlock size={32} className="text-green-600 mx-auto mb-2" />
            <p className="text-gray-600 text-sm mb-2">Unblocked Cameras</p>
            <p className="text-3xl font-bold text-green-600">
              {devices.filter((d) => d.cameraStatus === 'unblocked').length}
            </p>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}

export default DeviceManagement;
