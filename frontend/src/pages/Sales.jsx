import React, { useEffect, useState } from 'react';
import { salesService } from '../services/salesService';
import jsPDF from 'jspdf';
import ConfirmDialog from '../components/ConfirmDialog';
import AlertDialog from '../components/AlertDialog';

const Sales = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, type: '', orderId: null });
    const [alertDialog, setAlertDialog] = useState({ isOpen: false, message: '', type: 'info' });

    useEffect(() => {
        loadSales();
    }, []);

    const loadSales = async () => {
        try {
            const data = await salesService.getAll();
            setSales(data.sales);
        } catch (error) {
            console.error('Error loading sales:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        setConfirmDialog({ isOpen: true, type: 'approve', orderId: id });
    };

    const handleReject = async (id) => {
        setConfirmDialog({ isOpen: true, type: 'reject', orderId: id });
    };

    const confirmAction = async () => {
        try {
            if (confirmDialog.type === 'approve') {
                await salesService.approve(confirmDialog.orderId);
                setAlertDialog({ isOpen: true, message: 'Order approved successfully!', type: 'success' });
            } else if (confirmDialog.type === 'reject') {
                await salesService.reject(confirmDialog.orderId);
                setAlertDialog({ isOpen: true, message: 'Order rejected successfully!', type: 'success' });
            }
            loadSales();
        } catch (error) {
            setAlertDialog({
                isOpen: true,
                message: error.response?.data?.message || `Error ${confirmDialog.type}ing order`,
                type: 'error'
            });
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
        doc.text(`Status: ${order.status.toUpperCase()}`, 20, 56);

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

    const filteredSales = sales.filter(sale => {
        if (filter === 'all') return true;
        return sale.status === filter;
    });

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Order Management</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${filter === 'all' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${filter === 'pending' ? 'bg-yellow-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}`}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() => setFilter('approved')}
                        className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${filter === 'approved' ? 'bg-green-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}`}
                    >
                        Approved
                    </button>
                    <button
                        onClick={() => setFilter('rejected')}
                        className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${filter === 'rejected' ? 'bg-red-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}`}
                    >
                        Rejected
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-left font-semibold text-gray-700">Order ID</th>
                            <th className="px-6 py-4 text-left font-semibold text-gray-700">Customer</th>
                            <th className="px-6 py-4 text-left font-semibold text-gray-700">Items</th>
                            <th className="px-6 py-4 text-left font-semibold text-gray-700">Total</th>
                            <th className="px-6 py-4 text-left font-semibold text-gray-700">Status</th>
                            <th className="px-6 py-4 text-left font-semibold text-gray-700">Date</th>
                            <th className="px-6 py-4 text-left font-semibold text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSales.map((sale) => (
                            <tr key={sale._id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-mono text-sm text-gray-600">#{sale._id.slice(-8)}</td>
                                <td className="px-6 py-4 font-medium text-gray-800">{sale.customerId?.name || 'N/A'}</td>
                                <td className="px-6 py-4 text-gray-600">{sale.items.length} items</td>
                                <td className="px-6 py-4 font-bold text-blue-600">${sale.totalAmount.toFixed(2)}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${sale.status === 'approved' ? 'bg-green-100 text-green-800' :
                                        sale.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {sale.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{new Date(sale.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                    {sale.status === 'pending' && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleApprove(sale._id)}
                                                className="text-green-600 hover:text-green-700 font-semibold transition-colors"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(sale._id)}
                                                className="text-red-600 hover:text-red-700 font-semibold transition-colors"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                    {sale.status === 'approved' && (
                                        <button
                                            onClick={() => downloadReceipt(sale)}
                                            className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                                        >
                                            Download PDF
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
                onClose={() => setConfirmDialog({ isOpen: false, type: '', orderId: null })}
                onConfirm={confirmAction}
                title={confirmDialog.type === 'approve' ? 'Approve Order' : 'Reject Order'}
                message={
                    confirmDialog.type === 'approve'
                        ? 'Are you sure you want to approve this order?'
                        : 'Are you sure you want to reject this order? This will restore the product stock.'
                }
                confirmText={confirmDialog.type === 'approve' ? 'Approve' : 'Reject'}
                confirmColor={confirmDialog.type === 'approve' ? 'green' : 'red'}
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

export default Sales;
