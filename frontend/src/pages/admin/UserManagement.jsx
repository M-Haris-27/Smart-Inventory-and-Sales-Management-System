import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import ConfirmDialog from '../../components/ConfirmDialog';
import AlertDialog from '../../components/AlertDialog';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'staff'
    });
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, userId: null });
    const [alertDialog, setAlertDialog] = useState({ isOpen: false, message: '', type: 'info' });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await adminService.getUsers();
            setUsers(data.users);
        } catch (error) {
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await adminService.createUser(formData);
            setFormData({ name: '', email: '', password: '', role: 'staff' });
            setShowForm(false);
            loadUsers();
            setAlertDialog({ isOpen: true, message: 'User created successfully!', type: 'success' });
        } catch (error) {
            setAlertDialog({
                isOpen: true,
                message: error.response?.data?.message || 'Error creating user',
                type: 'error'
            });
        }
    };

    const handleDelete = async (id) => {
        setConfirmDialog({ isOpen: true, userId: id });
    };

    const confirmDelete = async () => {
        try {
            await adminService.deleteUser(confirmDialog.userId);
            loadUsers();
            setAlertDialog({ isOpen: true, message: 'User deleted successfully!', type: 'success' });
        } catch (error) {
            setAlertDialog({
                isOpen: true,
                message: error.response?.data?.message || 'Error deleting user',
                type: 'error'
            });
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">User Management</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    {showForm ? 'Cancel' : 'Create User'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <h2 className="text-xl font-bold mb-4">Create New User</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="px-3 py-2 border rounded"
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="px-3 py-2 border rounded"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="px-3 py-2 border rounded"
                            required
                        />
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="px-3 py-2 border rounded"
                        >
                            <option value="staff">Staff</option>
                            <option value="customer">Customer</option>
                        </select>
                        <button type="submit" className="bg-green-600 text-white py-2 rounded hover:bg-green-700">
                            Create User
                        </button>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left">Name</th>
                            <th className="px-6 py-3 text-left">Email</th>
                            <th className="px-6 py-3 text-left">Role</th>
                            <th className="px-6 py-3 text-left">Created</th>
                            <th className="px-6 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} className="border-t">
                                <td className="px-6 py-4">{user.name}</td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs ${user.role === 'admin' ? 'bg-red-100 text-red-800' :
                                        user.role === 'staff' ? 'bg-blue-100 text-blue-800' :
                                            'bg-green-100 text-green-800'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                    {user.role !== 'admin' && (
                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            className="text-red-600 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                onClose={() => setConfirmDialog({ isOpen: false, userId: null })}
                onConfirm={confirmDelete}
                title="Delete User"
                message="Are you sure you want to delete this user? This action cannot be undone."
                confirmText="Delete"
                confirmColor="red"
            />

            <AlertDialog
                isOpen={alertDialog.isOpen}
                onClose={() => setAlertDialog({ isOpen: false, message: '', type: 'info' })}
                title={alertDialog.type === 'error' ? 'Error' : 'Success'}
                message={alertDialog.message}
                type={alertDialog.type}
            />
        </div>
    );
};

export default UserManagement;
