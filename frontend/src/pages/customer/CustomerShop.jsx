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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 shadow-2xl">
                <div className="container mx-auto px-4">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-3 bg-white/10 rounded-xl">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold">Welcome to SISMS Shop</h1>
                            <p className="text-blue-100 text-lg">Browse and purchase products</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
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
                    <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                        <p className="text-gray-500 text-lg">No products found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <div key={product._id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 border border-gray-100">
                                <div className="p-6">
                                    <div className="mb-4">
                                        <span className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-lg">
                                            {product.category}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-gray-800">{product.name}</h3>
                                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                                        ${product.price.toFixed(2)}
                                    </p>
                                    <p className="text-sm text-gray-600 mb-4 bg-gray-50 px-3 py-2 rounded-lg">
                                        In Stock: <span className="font-semibold">{product.quantity}</span> units
                                    </p>
                                    <button
                                        onClick={() => handlePurchase(product)}
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
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
