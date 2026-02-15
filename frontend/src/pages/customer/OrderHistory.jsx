import React, { useEffect, useState } from 'react';
import { salesService } from '../../services/salesService';
import { useSelector } from 'react-redux';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const data = await salesService.getAll({ customerId: user.id });
            setOrders(data.sales);
        } catch (error) {
            console.error('Error loading orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const downloadReceipt = (order) => {
        const receiptContent = generateReceipt(order);
        const blob = new Blob([receiptContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `receipt-${order._id}.txt`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const generateReceipt = (order) => {
        let receipt = '========================================\n';
        receipt += '           SISMS RECEIPT\n';
        receipt += '========================================\n\n';
        receipt += `Order ID: ${order._id}\n`;
        receipt += `Date: ${new Date(order.createdAt).toLocaleString()}\n`;
        receipt += `Customer: ${order.customerId?.name || 'N/A'}\n\n`;
        receipt += '----------------------------------------\n';
        receipt += 'ITEMS:\n';
        receipt += '----------------------------------------\n';

        order.items.forEach((item, index) => {
            receipt += `${index + 1}. ${item.productId?.name || 'Product'}\n`;
            receipt += `   Qty: ${item.quantity} x $${item.price.toFixed(2)} = $${(item.quantity * item.price).toFixed(2)}\n\n`;
        });

        receipt += '----------------------------------------\n';
        receipt += `TOTAL: $${order.totalAmount.toFixed(2)}\n`;
        receipt += '========================================\n';
        receipt += '      Thank you for your purchase!\n';
        receipt += '========================================\n';

        return receipt;
    };

    if (loading) return <div className="p-6">Loading orders...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-blue-600 text-white py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold">Order History</h1>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                {orders.length === 0 ? (
                    <div className="bg-white p-8 rounded-lg shadow text-center">
                        <p className="text-gray-500 text-lg">No orders yet</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-lg shadow p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold">Order #{order._id.slice(-8)}</h3>
                                        <p className="text-sm text-gray-600">
                                            {new Date(order.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => downloadReceipt(order)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    >
                                        Download Receipt
                                    </button>
                                </div>

                                <div className="border-t pt-4">
                                    <h4 className="font-semibold mb-2">Items:</h4>
                                    <div className="space-y-2">
                                        {order.items.map((item, index) => (
                                            <div key={index} className="flex justify-between text-sm">
                                                <span>
                                                    {item.productId?.name || 'Product'} x {item.quantity}
                                                </span>
                                                <span>${(item.quantity * item.price).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
                                        <span>Total:</span>
                                        <span className="text-blue-600">${order.totalAmount.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistory;
