/**
 * User Form Modal
 * Create (add) or update (edit) an admin user.
 * Field set mirrors the backend API spec:
 *   POST /admin/users  → username, email, password, first_name, last_name, role
 *   PATCH /admin/users/:id → email, first_name, last_name, password?, status, role
 */
import { useState, useEffect } from 'react';
import { Modal, Input, Button } from '../../components/Common';
import { isValidEmail, isValidPassword } from '../../utils/validators';

const EMPTY_FORM = {
  first_name: '',
  last_name: '',
  username: '',
  email: '',
  password: '',
  role: 'admin',
  status: 'ACTIVE',
};

function UserFormModal({ isOpen, onClose, onSave, mode, user, submitting }) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === 'edit' && user) {
      setFormData({
        first_name: user.first_name ?? '',
        last_name: user.last_name ?? '',
        username: user.username ?? '',
        email: user.email ?? '',
        password: '',
        role: user.role ?? 'admin',
        status: user.status ?? 'ACTIVE',
      });
    } else {
      setFormData(EMPTY_FORM);
    }
    setErrors({});
  }, [user, mode, isOpen]);

  const validate = () => {
    const e = {};
    if (!formData.first_name.trim()) e.first_name = 'First name is required';
    if (!formData.last_name.trim()) e.last_name = 'Last name is required';
    if (mode === 'add') {
      if (!formData.username.trim()) e.username = 'Username is required';
      else if (formData.username.trim().length < 3) e.username = 'Username must be at least 3 characters';
    }
    if (!formData.email.trim()) e.email = 'Email is required';
    else if (!isValidEmail(formData.email)) e.email = 'Please enter a valid email';
    if (mode === 'add') {
      if (!formData.password) e.password = 'Password is required';
      else if (!isValidPassword(formData.password))
        e.password = 'Min 8 chars, include uppercase, lowercase, and a number';
    } else if (formData.password && !isValidPassword(formData.password)) {
      e.password = 'Min 8 chars, include uppercase, lowercase, and a number';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const payload = { ...formData };
    // Don't send empty password on edit
    if (mode === 'edit' && !payload.password) delete payload.password;
    // username is not updatable via PATCH per API spec
    if (mode === 'edit') delete payload.username;
    await onSave(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'add' ? 'Add New Admin User' : 'Edit Admin User'}
      size="md"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            error={errors.first_name}
            placeholder="John"
            required
          />
          <Input
            label="Last Name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            error={errors.last_name}
            placeholder="Doe"
            required
          />
        </div>

        {mode === 'add' && (
          <Input
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            placeholder="johndoe"
            required
            autoComplete="off"
          />
        )}

        <Input
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="john.doe@company.com"
          required
          autoComplete="off"
        />

        <Input
          label={mode === 'add' ? 'Password' : 'New Password (leave blank to keep current)'}
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          placeholder={mode === 'add' ? 'Min 8 chars, upper + lower + number' : '••••••••'}
          required={mode === 'add'}
          autoComplete="new-password"
        />

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1.5">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="mt-1.5 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>

        {mode === 'edit' && (
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1.5 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-6">
        <Button variant="secondary" onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} isLoading={submitting}>
          {mode === 'add' ? 'Create User' : 'Save Changes'}
        </Button>
      </div>
    </Modal>
  );
}

export default UserFormModal;

