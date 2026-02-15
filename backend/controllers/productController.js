const Product = require('../models/Product');

// Get all products
const getProducts = async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = {};

        if (category) {
            query.category = category;
        }

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const products = await Product.find(query).sort({ createdAt: -1 });
        res.json({ success: true, count: products.length, products });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ message: 'Server error fetching products' });
    }
};

// Get single product
const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ success: true, product });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ message: 'Server error fetching product' });
    }
};

// Create product
const createProduct = async (req, res) => {
    try {
        const { name, category, price, quantity } = req.body;

        // Validation
        if (!name || !category || !price) {
            return res.status(400).json({ message: 'Please provide name, category, and price' });
        }

        if (price < 0) {
            return res.status(400).json({ message: 'Price cannot be negative' });
        }

        const product = await Product.create({
            name,
            category,
            price,
            quantity: quantity || 0
        });

        res.status(201).json({ success: true, product });
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({ message: 'Server error creating product' });
    }
};

// Update product
const updateProduct = async (req, res) => {
    try {
        const { name, category, price, quantity } = req.body;

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Validation
        if (price && price < 0) {
            return res.status(400).json({ message: 'Price cannot be negative' });
        }

        if (quantity && quantity < 0) {
            return res.status(400).json({ message: 'Quantity cannot be negative' });
        }

        product.name = name || product.name;
        product.category = category || product.category;
        product.price = price !== undefined ? price : product.price;
        product.quantity = quantity !== undefined ? quantity : product.quantity;

        await product.save();

        res.json({ success: true, product });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ message: 'Server error updating product' });
    }
};

// Delete product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.deleteOne();
        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ message: 'Server error deleting product' });
    }
};

// Stock in (add stock)
const stockIn = async (req, res) => {
    try {
        const { quantity } = req.body;

        if (!quantity || quantity <= 0) {
            return res.status(400).json({ message: 'Please provide valid quantity' });
        }

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.quantity += quantity;
        await product.save();

        res.json({
            success: true,
            message: `Added ${quantity} units to stock`,
            product
        });
    } catch (error) {
        console.error('Stock in error:', error);
        res.status(500).json({ message: 'Server error updating stock' });
    }
};

// Stock out (remove stock)
const stockOut = async (req, res) => {
    try {
        const { quantity } = req.body;

        if (!quantity || quantity <= 0) {
            return res.status(400).json({ message: 'Please provide valid quantity' });
        }

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.quantity < quantity) {
            return res.status(400).json({ message: 'Insufficient stock available' });
        }

        product.quantity -= quantity;
        await product.save();

        res.json({
            success: true,
            message: `Removed ${quantity} units from stock`,
            product
        });
    } catch (error) {
        console.error('Stock out error:', error);
        res.status(500).json({ message: 'Server error updating stock' });
    }
};

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    stockIn,
    stockOut
};
