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
            <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Dashboard</h1>

            {user?.role === 'admin' && dashboard ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                            <h3 className="text-gray-500 text-sm font-semibold mb-2">Total Products</h3>
                            <p className="text-4xl font-bold text-blue-600">{dashboard.overview.totalProducts}</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                            <h3 className="text-gray-500 text-sm font-semibold mb-2">Total Customers</h3>
                            <p className="text-4xl font-bold text-green-600">{dashboard.overview.totalCustomers}</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                            <h3 className="text-gray-500 text-sm font-semibold mb-2">Total Sales</h3>
                            <p className="text-4xl font-bold text-purple-600">{dashboard.overview.totalSales}</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                            <h3 className="text-gray-500 text-sm font-semibold mb-2">Total Revenue</h3>
                            <p className="text-4xl font-bold text-orange-600">${dashboard.overview.totalRevenue.toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                            <h2 className="text-xl font-bold mb-4 text-gray-800">Low Stock Products</h2>
                            {dashboard.lowStockProducts.length > 0 ? (
                                <div className="space-y-3">
                                    {dashboard.lowStockProducts.map((product) => (
                                        <div key={product._id} className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0">
                                            <span className="font-medium text-gray-700">{product.name}</span>
                                            <span className="text-red-600 font-bold bg-red-50 px-3 py-1 rounded-lg">{product.quantity} units</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No low stock products</p>
                            )}
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                            <h2 className="text-xl font-bold mb-4 text-gray-800">Recent Sales</h2>
                            {dashboard.recentSales.length > 0 ? (
                                <div className="space-y-3">
                                    {dashboard.recentSales.map((sale) => (
                                        <div key={sale._id} className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0">
                                            <span className="font-medium text-gray-700">{sale.customerId?.name || 'N/A'}</span>
                                            <span className="font-bold text-blue-600">${sale.totalAmount.toFixed(2)}</span>
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
                <div className="bg-white p-12 rounded-2xl shadow-2xl text-center border border-gray-100">
                    <div className="inline-block p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg mb-6">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Welcome to SISMS</h2>
                    <p className="text-gray-600 text-lg">Use the navigation menu to manage products, customers, and sales.</p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
