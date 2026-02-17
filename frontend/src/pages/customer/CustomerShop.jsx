import React, { useEffect, useState } from 'react';
import { productService } from '../../services/productService';
import { salesService } from '../../services/salesService';
import InputDialog from '../../components/InputDialog';
import AlertDialog from '../../components/AlertDialog';
import { useSelector } from 'react-redux';

const CustomerShop = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useSelector((state) => state.auth);
    const [inputDialog, setInputDialog] = useState({ isOpen: false, product: null });
    const [alertDialog, setAlertDialog] = useState({ isOpen: false, message: '', type: 'info' });

    useEffect(() => {
        loadProducts();
    }, []);

    useEffect(() => {
        filterProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm, selectedCategory, products]);

    const loadProducts = async () => {
        try {
            const data = await productService.getAll();
            const availableProducts = data.products.filter(p => p.quantity > 0);
            setProducts(availableProducts);

            const uniqueCategories = [...new Set(availableProducts.map(p => p.category))];
            setCategories(uniqueCategories);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterProducts = () => {
        let filtered = products;

        if (searchTerm) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory) {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }

        setFilteredProducts(filtered);
    };

    const handlePurchase = async (product) => {
        setInputDialog({ isOpen: true, product });
    };

    const confirmPurchase = async (quantity) => {
        const product = inputDialog.product;

        if (!quantity || isNaN(quantity) || quantity <= 0) {
            setAlertDialog({ isOpen: true, message: 'Please enter a valid quantity', type: 'error' });
            return;
        }

        if (parseInt(quantity) > product.quantity) {
            setAlertDialog({ isOpen: true, message: 'Not enough stock available', type: 'error' });
            return;
        }

        try {
            const saleData = {
                customerId: user.id,
                items: [{
                    productId: product._id,
                    quantity: parseInt(quantity)
                }]
            };

            await salesService.create(saleData);
            setAlertDialog({
                isOpen: true,
                message: 'Purchase successful! Your order is pending approval. You can view it in Order History.',
                type: 'success'
            });
            loadProducts();
        } catch (error) {
            setAlertDialog({
                isOpen: true,
                message: error.response?.data?.message || 'Error processing purchase',
                type: 'error'
            });
        }
    };

    if (loading) return <div className="p-6">Loading products...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-blue-600 text-white py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-2">Welcome to SISMS Shop</h1>
                    <p className="text-blue-100">Browse and purchase products</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                <div className="bg-white p-4 rounded-lg shadow mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Categories</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No products found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <div key={product._id} className="bg-white rounded-lg shadow hover:shadow-lg transition">
                                <div className="p-6">
                                    <div className="mb-4">
                                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                            {product.category}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                                    <p className="text-3xl font-bold text-blue-600 mb-2">
                                        ${product.price.toFixed(2)}
                                    </p>
                                    <p className="text-sm text-gray-600 mb-4">
                                        In Stock: {product.quantity} units
                                    </p>
                                    <button
                                        onClick={() => handlePurchase(product)}
                                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                                    >
                                        Purchase Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <InputDialog
                isOpen={inputDialog.isOpen}
                onClose={() => setInputDialog({ isOpen: false, product: null })}
                onConfirm={confirmPurchase}
                title="Purchase Product"
                message={inputDialog.product ? `How many ${inputDialog.product.name} would you like to purchase? (Available: ${inputDialog.product.quantity})` : ''}
                placeholder="Enter quantity"
                inputType="number"
                defaultValue="1"
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

export default CustomerShop;
