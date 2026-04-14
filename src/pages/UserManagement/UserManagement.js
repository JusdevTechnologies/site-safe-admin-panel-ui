/**
 * User Management Page
 * Complete CRUD functionality for managing admin users
 */
import { useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { MainLayout } from '../../components/Layout';
import { Card, Table, Badge, Button, Input, Modal } from '../../components/Common';
import { formatDateTime } from '../../utils/helpers';
import UserFormModal from './UserFormModal';

function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@sitesafe.com',
      role: 'Super Admin',
      status: 'active',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60000),
      lastLogin: new Date(Date.now() - 5 * 60000),
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@sitesafe.com',
      role: 'Admin',
      status: 'active',
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60000),
      lastLogin: new Date(Date.now() - 30 * 60000),
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@sitesafe.com',
      role: 'Super Admin',
      status: 'active',
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60000),
      lastLogin: new Date(Date.now() - 2 * 60 * 60000),
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@sitesafe.com',
      role: 'Admin',
      status: 'inactive',
      createdAt: new Date(Date.now() - 120 * 24 * 60 * 60000),
      lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60000),
    },
  ]);

  const handleAddUser = () => {
    setFormMode('add');
    setSelectedUser(null);
    setShowFormModal(true);
  };

  const handleEditUser = (user) => {
    setFormMode('edit');
    setSelectedUser(user);
    setShowFormModal(true);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      setUsers(users.filter((u) => u.id !== userToDelete.id));
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const handleSaveUser = (userData) => {
    if (formMode === 'add') {
      const newUser = {
        id: Math.max(...users.map((u) => u.id), 0) + 1,
        ...userData,
        createdAt: new Date(),
        lastLogin: null,
      };
      setUsers([...users, newUser]);
    } else if (selectedUser) {
      setUsers(
        users.map((u) =>
          u.id === selectedUser.id
            ? { ...u, ...userData }
            : u
        )
      );
    }
    setShowFormModal(false);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const userColumns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Badge variant={row.status === 'active' ? 'success' : 'default'}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'lastLogin',
      label: 'Last Login',
      render: (row) =>
        row.lastLogin ? formatDateTime(row.lastLogin) : <span className="text-gray-400">Never</span>,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleEditUser(row)}
            className="text-xs"
          >
            <Edit size={14} />
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDeleteClick(row)}
            className="text-xs"
          >
            <Trash2 size={14} />
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout title="User Management">
      {/* Header with Add Button */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-start md:items-center">
        <Input
          placeholder="Search by name or email..."
          prefix={<Search size={18} />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          containerClassName="flex-1"
        />
        <Button
          variant="primary"
          onClick={handleAddUser}
          className="gap-2 w-full md:w-auto"
        >
          <Plus size={18} />
          Add User
        </Button>
      </div>

      {/* Users Table */}
      <Card
        title="Admin Users"
        subtitle={`Total: ${filteredUsers.length} user${filteredUsers.length !== 1 ? 's' : ''}`}
      >
        <Table columns={userColumns} data={filteredUsers} />
      </Card>

      {/* Statistics */}
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
            <p className="text-3xl font-bold text-green-600">
              {users.filter((u) => u.status === 'active').length}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2">Super Admins</p>
            <p className="text-3xl font-bold text-blue-600">
              {users.filter((u) => u.role === 'Super Admin').length}
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
            Are you sure you want to delete <strong>{userToDelete?.name}</strong>?
          </p>
          <p className="text-sm text-gray-600">
            This action cannot be undone. The user account will be permanently deleted.
          </p>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete User
          </Button>
        </div>
      </Modal>
    </MainLayout>
  );
}

export default UserManagement;
