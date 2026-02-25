import React, { useEffect, useState } from 'react';
import { salesService } from '../../services/salesService';
import { useSelector } from 'react-redux';
import jsPDF from 'jspdf';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        loadOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.setFont(undefined, 'bold');
        doc.text('SISMS RECEIPT', 105, 20, { align: 'center' });

        doc.setLineWidth(0.5);
        doc.line(20, 25, 190, 25);

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text(`Order ID: ${order._id}`, 20, 35);
        doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 20, 42);
        doc.text(`Customer: ${order.customerId?.name || 'N/A'}`, 20, 49);
        doc.text(`Email: ${order.customerId?.email || 'N/A'}`, 20, 56);

        doc.line(20, 62, 190, 62);

        doc.setFont(undefined, 'bold');
        doc.text('ITEMS', 20, 70);
        doc.setFont(undefined, 'normal');

        let yPosition = 78;
        order.items.forEach((item, index) => {
            const productName = item.productId?.name || 'Product';
            const quantity = item.quantity;
            const price = item.price.toFixed(2);
            const total = (quantity * item.price).toFixed(2);

            doc.text(`${index + 1}. ${productName}`, 20, yPosition);
            doc.text(`Qty: ${quantity} x $${price}`, 30, yPosition + 5);
            doc.text(`$${total}`, 170, yPosition + 5, { align: 'right' });

            yPosition += 12;
        });

        doc.line(20, yPosition, 190, yPosition);
        yPosition += 8;

        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('TOTAL:', 130, yPosition);
        doc.text(`$${order.totalAmount.toFixed(2)}`, 190, yPosition, { align: 'right' });

        yPosition += 15;
        doc.setFontSize(10);
        doc.setFont(undefined, 'italic');
        doc.text('Thank you for your purchase!', 105, yPosition, { align: 'center' });

        doc.save(`receipt-${order._id}.pdf`);
    };

    if (loading) return <div className="p-6">Loading orders...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 shadow-2xl">
                <div className="container mx-auto px-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-3 bg-white/10 rounded-xl">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-bold">Order History</h1>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {orders.length === 0 ? (
                    <div className="bg-white p-12 rounded-2xl shadow-2xl text-center border border-gray-100">
                        <div className="inline-block p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl mb-4">
                            <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <p className="text-gray-500 text-lg">No orders yet</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">Order #{order._id.slice(-8)}</h3>
                                        <p className="text-sm text-gray-600 mb-3">
                                            {new Date(order.createdAt).toLocaleString()}
                                        </p>
                                        <span className={`inline-block px-4 py-2 rounded-xl text-sm font-semibold ${order.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            order.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {order.status === 'pending' ? 'Pending Approval' :
                                                order.status === 'approved' ? 'Approved' : 'Rejected'}
                                        </span>
                                    </div>
                                    {order.status === 'approved' && (
                                        <button
                                            onClick={() => downloadReceipt(order)}
                                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 flex items-center gap-2 font-semibold shadow-lg transition-all"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Download PDF
                                        </button>
                                    )}
                                    {order.status === 'pending' && (
                                        <div className="text-yellow-600 text-sm bg-yellow-50 px-4 py-2 rounded-xl font-medium">
                                            Waiting for approval
                                        </div>
                                    )}
                                </div>

                                <div className="border-t border-gray-100 pt-6">
                                    <h4 className="font-bold text-gray-800 mb-4">Items:</h4>
                                    <div className="space-y-3">
                                        {order.items.map((item, index) => (
                                            <div key={index} className="flex justify-between text-sm bg-gray-50 p-3 rounded-xl">
                                                <span className="font-medium text-gray-700">
                                                    {item.productId?.name || 'Product'} <span className="text-gray-500">x {item.quantity}</span>
                                                </span>
                                                <span className="font-bold text-blue-600">${(item.quantity * item.price).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="border-t border-gray-200 mt-6 pt-6 flex justify-between items-center">
                                        <span className="text-xl font-bold text-gray-800">Total:</span>
                                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">${order.totalAmount.toFixed(2)}</span>
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
