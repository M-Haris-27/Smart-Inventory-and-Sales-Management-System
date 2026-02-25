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
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">User Management</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                    {showForm ? 'Cancel' : 'Create User'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-8 rounded-2xl shadow-2xl mb-8 border border-gray-100">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New User</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            required
                        />
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                        >
                            <option value="staff">Staff</option>
                            <option value="customer">Customer</option>
                        </select>
                        <button type="submit" className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3.5 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg">
                            Create User
                        </button>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-left font-semibold text-gray-700">Name</th>
                            <th className="px-6 py-4 text-left font-semibold text-gray-700">Email</th>
                            <th className="px-6 py-4 text-left font-semibold text-gray-700">Role</th>
                            <th className="px-6 py-4 text-left font-semibold text-gray-700">Created</th>
                            <th className="px-6 py-4 text-left font-semibold text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-800">{user.name}</td>
                                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${user.role === 'admin' ? 'bg-red-100 text-red-800' :
                                        user.role === 'staff' ? 'bg-blue-100 text-blue-800' :
                                            'bg-green-100 text-green-800'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                    {user.role !== 'admin' && (
                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            className="text-red-600 hover:text-red-700 font-semibold transition-colors"
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
