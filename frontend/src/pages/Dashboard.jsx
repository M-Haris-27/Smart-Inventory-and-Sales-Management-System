import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { adminService } from '../services/adminService';

const Dashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.role === 'admin') {
            loadDashboard();
        } else {
            setLoading(false);
        }
    }, [user]);

    const loadDashboard = async () => {
        try {
            const data = await adminService.getDashboard();
            setDashboard(data.dashboard);
        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

            {user?.role === 'admin' && dashboard ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-gray-500 text-sm">Total Products</h3>
                            <p className="text-3xl font-bold text-blue-600">{dashboard.overview.totalProducts}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-gray-500 text-sm">Total Customers</h3>
                            <p className="text-3xl font-bold text-green-600">{dashboard.overview.totalCustomers}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-gray-500 text-sm">Total Sales</h3>
                            <p className="text-3xl font-bold text-purple-600">{dashboard.overview.totalSales}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-gray-500 text-sm">Total Revenue</h3>
                            <p className="text-3xl font-bold text-orange-600">${dashboard.overview.totalRevenue.toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-xl font-bold mb-4">Low Stock Products</h2>
                            {dashboard.lowStockProducts.length > 0 ? (
                                <div className="space-y-2">
                                    {dashboard.lowStockProducts.map((product) => (
                                        <div key={product._id} className="flex justify-between items-center border-b pb-2">
                                            <span>{product.name}</span>
                                            <span className="text-red-600 font-semibold">{product.quantity} units</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No low stock products</p>
                            )}
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-xl font-bold mb-4">Recent Sales</h2>
                            {dashboard.recentSales.length > 0 ? (
                                <div className="space-y-2">
                                    {dashboard.recentSales.map((sale) => (
                                        <div key={sale._id} className="flex justify-between items-center border-b pb-2">
                                            <span>{sale.customerId?.name || 'N/A'}</span>
                                            <span className="font-semibold">${sale.totalAmount.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No recent sales</p>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <div className="bg-white p-8 rounded-lg shadow text-center">
                    <h2 className="text-2xl font-bold mb-4">Welcome to SISMS</h2>
                    <p className="text-gray-600">Use the navigation menu to manage products, customers, and sales.</p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
