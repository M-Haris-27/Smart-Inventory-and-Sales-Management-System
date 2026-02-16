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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Products</h1>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        setEditId(null);
                        setFormData({ name: '', category: '', price: '', quantity: '' });
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    {showForm ? 'Cancel' : 'Add Product'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <h2 className="text-xl font-bold mb-4">{editId ? 'Edit' : 'Add'} Product</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Product Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="px-3 py-2 border rounded"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Category"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="px-3 py-2 border rounded"
                            required
                        />
                        <input
                            type="number"
                            step="0.01"
                            placeholder="Price"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="px-3 py-2 border rounded"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Quantity"
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            className="px-3 py-2 border rounded"
                            required
                        />
                        <button type="submit" className="col-span-2 bg-green-600 text-white py-2 rounded hover:bg-green-700">
                            {editId ? 'Update' : 'Create'} Product
                        </button>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left">Name</th>
                            <th className="px-6 py-3 text-left">Category</th>
                            <th className="px-6 py-3 text-left">Price</th>
                            <th className="px-6 py-3 text-left">Quantity</th>
                            <th className="px-6 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id} className="border-t">
                                <td className="px-6 py-4">{product.name}</td>
                                <td className="px-6 py-4">{product.category}</td>
                                <td className="px-6 py-4">${product.price.toFixed(2)}</td>
                                <td className="px-6 py-4">{product.quantity}</td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleEdit(product)}
                                        className="text-blue-600 hover:underline mr-3"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product._id)}
                                        className="text-red-600 hover:underline"
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
