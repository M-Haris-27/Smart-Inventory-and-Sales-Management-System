import React, { useEffect, useState } from 'react';
import { productService } from '../services/productService';
import ConfirmDialog from '../components/ConfirmDialog';
import AlertDialog from '../components/AlertDialog';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        quantity: ''
    });
    const [editId, setEditId] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, productId: null });
    const [alertDialog, setAlertDialog] = useState({ isOpen: false, message: '', type: 'info' });

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await productService.getAll();
            setProducts(data.products);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await productService.update(editId, formData);
                setAlertDialog({ isOpen: true, message: 'Product updated successfully!', type: 'success' });
            } else {
                await productService.create(formData);
                setAlertDialog({ isOpen: true, message: 'Product created successfully!', type: 'success' });
            }
            setFormData({ name: '', category: '', price: '', quantity: '' });
            setEditId(null);
            setShowForm(false);
            loadProducts();
        } catch (error) {
            setAlertDialog({
                isOpen: true,
                message: error.response?.data?.message || 'Error saving product',
                type: 'error'
            });
        }
    };

    const handleEdit = (product) => {
        setFormData({
            name: product.name,
            category: product.category,
            price: product.price,
            quantity: product.quantity
        });
        setEditId(product._id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        setConfirmDialog({ isOpen: true, productId: id });
    };

    const confirmDelete = async () => {
        try {
            await productService.delete(confirmDialog.productId);
            setAlertDialog({ isOpen: true, message: 'Product deleted successfully!', type: 'success' });
            loadProducts();
        } catch (error) {
            setAlertDialog({
                isOpen: true,
                message: error.response?.data?.message || 'Error deleting product',
                type: 'error'
            });
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Products</h1>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        setEditId(null);
                        setFormData({ name: '', category: '', price: '', quantity: '' });
                    }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                    {showForm ? 'Cancel' : 'Add Product'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-8 rounded-2xl shadow-2xl mb-8 border border-gray-100">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">{editId ? 'Edit' : 'Add'} Product</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-5">
                        <input
                            type="text"
                            placeholder="Product Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Category"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            required
                        />
                        <input
                            type="number"
                            step="0.01"
                            placeholder="Price"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Quantity"
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            required
                        />
                        <button type="submit" className="col-span-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3.5 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg">
                            {editId ? 'Update' : 'Create'} Product
                        </button>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-left font-semibold text-gray-700">Name</th>
                            <th className="px-6 py-4 text-left font-semibold text-gray-700">Category</th>
                            <th className="px-6 py-4 text-left font-semibold text-gray-700">Price</th>
                            <th className="px-6 py-4 text-left font-semibold text-gray-700">Quantity</th>
                            <th className="px-6 py-4 text-left font-semibold text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-800">{product.name}</td>
                                <td className="px-6 py-4 text-gray-600">{product.category}</td>
                                <td className="px-6 py-4 font-semibold text-blue-600">${product.price.toFixed(2)}</td>
                                <td className="px-6 py-4 text-gray-600">{product.quantity}</td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleEdit(product)}
                                        className="text-blue-600 hover:text-blue-700 font-semibold mr-4 transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product._id)}
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

            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                onClose={() => setConfirmDialog({ isOpen: false, productId: null })}
                onConfirm={confirmDelete}
                title="Delete Product"
                message="Are you sure you want to delete this product? This action cannot be undone."
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

export default Products;
