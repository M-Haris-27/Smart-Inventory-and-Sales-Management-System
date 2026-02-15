import React, { useEffect, useState } from 'react';
import { salesService } from '../services/salesService';
import { productService } from '../services/productService';
import { customerService } from '../services/customerService';

const Sales = () => {
    const [sales, setSales] = useState([]);
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        customerId: '',
        items: [{ productId: '', quantity: 1 }]
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [salesData, productsData, customersData] = await Promise.all([
                salesService.getAll(),
                productService.getAll(),
                customerService.getAll()
            ]);
            setSales(salesData.sales);
            setProducts(productsData.products);
            setCustomers(customersData.customers);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await salesService.create(formData);
            setFormData({ customerId: '', items: [{ productId: '', quantity: 1 }] });
            setShowForm(false);
            loadData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error creating sale');
        }
    };

    const addItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { productId: '', quantity: 1 }]
        });
    };

    const removeItem = (index) => {
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    };

    const updateItem = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index][field] = value;
        setFormData({ ...formData, items: newItems });
    };

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Sales</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    {showForm ? 'Cancel' : 'Create Sale'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <h2 className="text-xl font-bold mb-4">Create Sale</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Customer</label>
                            <select
                                value={formData.customerId}
                                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                                className="w-full px-3 py-2 border rounded"
                                required
                            >
                                <option value="">Select Customer</option>
                                {customers.map((customer) => (
                                    <option key={customer._id} value={customer._id}>
                                        {customer.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Items</label>
                            {formData.items.map((item, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <select
                                        value={item.productId}
                                        onChange={(e) => updateItem(index, 'productId', e.target.value)}
                                        className="flex-1 px-3 py-2 border rounded"
                                        required
                                    >
                                        <option value="">Select Product</option>
                                        {products.map((product) => (
                                            <option key={product._id} value={product._id}>
                                                {product.name} (${product.price})
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                                        className="w-24 px-3 py-2 border rounded"
                                        required
                                    />
                                    {formData.items.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeItem(index)}
                                            className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addItem}
                                className="mt-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                            >
                                Add Item
                            </button>
                        </div>

                        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                            Create Sale
                        </button>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left">Customer</th>
                            <th className="px-6 py-3 text-left">Items</th>
                            <th className="px-6 py-3 text-left">Total Amount</th>
                            <th className="px-6 py-3 text-left">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales.map((sale) => (
                            <tr key={sale._id} className="border-t">
                                <td className="px-6 py-4">{sale.customerId?.name || 'N/A'}</td>
                                <td className="px-6 py-4">{sale.items.length} items</td>
                                <td className="px-6 py-4">${sale.totalAmount.toFixed(2)}</td>
                                <td className="px-6 py-4">{new Date(sale.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Sales;
