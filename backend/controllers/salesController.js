const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Customer = require('../models/Customer');

// Get all sales
const getSales = async (req, res) => {
    try {
        const { startDate, endDate, customerId } = req.query;
        let query = {};

        // If user is a customer, only show their own sales
        if (req.user.role === 'customer') {
            query.customerId = req.user.id;
        } else if (customerId) {
            // Staff/Admin can filter by customer
            query.customerId = customerId;
        }

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const sales = await Sale.find(query)
            .populate('customerId', 'name email phone')
            .populate('items.productId', 'name category')
            .sort({ createdAt: -1 });

        res.json({ success: true, count: sales.length, sales });
    } catch (error) {
        console.error('Get sales error:', error);
        res.status(500).json({ message: 'Server error fetching sales' });
    }
};

// Get single sale
const getSale = async (req, res) => {
    try {
        const sale = await Sale.findById(req.params.id)
            .populate('customerId', 'name email phone')
            .populate('items.productId', 'name category price');

        if (!sale) {
            return res.status(404).json({ message: 'Sale not found' });
        }

        res.json({ success: true, sale });
    } catch (error) {
        console.error('Get sale error:', error);
        res.status(500).json({ message: 'Server error fetching sale' });
    }
};

// Create sale (invoice)
const createSale = async (req, res) => {
    try {
        const { customerId, items } = req.body;

        // Validation
        if (!customerId || !items || items.length === 0) {
            return res.status(400).json({ message: 'Please provide customer and items' });
        }

        // If user is a customer, use their ID; otherwise verify customer exists
        let verifiedCustomerId = customerId;

        if (req.user.role === 'customer') {
            verifiedCustomerId = req.user.id;
        } else {
            const customer = await Customer.findById(customerId);
            if (!customer) {
                return res.status(404).json({ message: 'Customer not found' });
            }
        }

        let totalAmount = 0;
        const saleItems = [];

        // Process each item
        for (const item of items) {
            const { productId, quantity } = item;

            if (!productId || !quantity || quantity <= 0) {
                return res.status(400).json({ message: 'Invalid item data' });
            }

            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ message: `Product ${productId} not found` });
            }

            if (product.quantity < quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for ${product.name}. Available: ${product.quantity}`
                });
            }

            // Reduce stock
            product.quantity -= quantity;
            await product.save();

            const itemTotal = product.price * quantity;
            totalAmount += itemTotal;

            saleItems.push({
                productId: product._id,
                quantity,
                price: product.price
            });
        }

        // Create sale
        const sale = await Sale.create({
            customerId: verifiedCustomerId,
            items: saleItems,
            totalAmount
        });

        const populatedSale = await Sale.findById(sale._id)
            .populate('customerId', 'name email phone')
            .populate('items.productId', 'name category');

        res.status(201).json({ success: true, sale: populatedSale });
    } catch (error) {
        console.error('Create sale error:', error);
        res.status(500).json({ message: 'Server error creating sale' });
    }
};

// Delete sale
const deleteSale = async (req, res) => {
    try {
        const sale = await Sale.findById(req.params.id);

        if (!sale) {
            return res.status(404).json({ message: 'Sale not found' });
        }

        await sale.deleteOne();
        res.json({ success: true, message: 'Sale deleted successfully' });
    } catch (error) {
        console.error('Delete sale error:', error);
        res.status(500).json({ message: 'Server error deleting sale' });
    }
};

module.exports = {
    getSales,
    getSale,
    createSale,
    deleteSale
};
