import React, { useEffect, useState } from 'react';
import { customerService } from '../services/customerService';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: ''
    });
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        try {
            const data = await customerService.getAll();
            setCustomers(data.customers);
        } catch (error) {
            console.error('Error loading customers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await customerService.update(editId, formData);
            } else {
                await customerService.create(formData);
            }
            setFormData({ name: '', phone: '', email: '' });
            setEditId(null);
            setShowForm(false);
            loadCustomers();
        } catch (error) {
            alert(error.response?.data?.message || 'Error saving customer');
        }
    };

    const handleEdit = (customer) => {
        setFormData({
            name: customer.name,
            phone: customer.phone,
            email: customer.email
        });
        setEditId(customer._id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this customer?')) {
            try {
                await customerService.delete(id);
                loadCustomers();
            } catch (error) {
                alert(error.response?.data?.message || 'Error deleting customer');
            }
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Customers</h1>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        setEditId(null);
                        setFormData({ name: '', phone: '', email: '' });
                    }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                    {showForm ? 'Cancel' : 'Add Customer'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-8 rounded-2xl shadow-2xl mb-8 border border-gray-100">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">{editId ? 'Edit' : 'Add'} Customer</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
                        <input
                            type="text"
                            placeholder="Customer Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            required
                        />
                        <input
                            type="tel"
                            placeholder="Phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                        <button type="submit" className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3.5 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg">
                            {editId ? 'Update' : 'Create'} Customer
                        </button>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-left font-semibold text-gray-700">Name</th>
                            <th className="px-6 py-4 text-left font-semibold text-gray-700">Phone</th>
                            <th className="px-6 py-4 text-left font-semibold text-gray-700">Email</th>
                            <th className="px-6 py-4 text-left font-semibold text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((customer) => (
                            <tr key={customer._id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-800">{customer.name}</td>
                                <td className="px-6 py-4 text-gray-600">{customer.phone}</td>
                                <td className="px-6 py-4 text-gray-600">{customer.email}</td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleEdit(customer)}
                                        className="text-blue-600 hover:text-blue-700 font-semibold mr-4 transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(customer._id)}
                                        className="text-red-600 hover:text-red-700 font-semibold transition-colors"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Customers;
