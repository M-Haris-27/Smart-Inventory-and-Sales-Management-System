const Customer = require('../models/Customer');

// Get all customers
const getCustomers = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ];
        }

        const customers = await Customer.find(query).sort({ createdAt: -1 });
        res.json({ success: true, count: customers.length, customers });
    } catch (error) {
        console.error('Get customers error:', error);
        res.status(500).json({ message: 'Server error fetching customers' });
    }
};

// Get single customer
const getCustomer = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.json({ success: true, customer });
    } catch (error) {
        console.error('Get customer error:', error);
        res.status(500).json({ message: 'Server error fetching customer' });
    }
};

// Create customer
const createCustomer = async (req, res) => {
    try {
        const { name, phone, email } = req.body;

        // Validation
        if (!name || !phone || !email) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Check if customer exists
        const existingCustomer = await Customer.findOne({
            $or: [{ email }, { phone }]
        });

        if (existingCustomer) {
            return res.status(400).json({ message: 'Customer with this email or phone already exists' });
        }

        const customer = await Customer.create({ name, phone, email });

        res.status(201).json({ success: true, customer });
    } catch (error) {
        console.error('Create customer error:', error);
        res.status(500).json({ message: 'Server error creating customer' });
    }
};

// Update customer
const updateCustomer = async (req, res) => {
    try {
        const { name, phone, email } = req.body;

        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Check for duplicate email/phone if updating
        if (email || phone) {
            const duplicate = await Customer.findOne({
                _id: { $ne: req.params.id },
                $or: [
                    email ? { email } : {},
                    phone ? { phone } : {}
                ]
            });

            if (duplicate) {
                return res.status(400).json({ message: 'Email or phone already in use' });
            }
        }

        customer.name = name || customer.name;
        customer.phone = phone || customer.phone;
        customer.email = email || customer.email;

        await customer.save();

        res.json({ success: true, customer });
    } catch (error) {
        console.error('Update customer error:', error);
        res.status(500).json({ message: 'Server error updating customer' });
    }
};

// Delete customer
const deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        await customer.deleteOne();
        res.json({ success: true, message: 'Customer deleted successfully' });
    } catch (error) {
        console.error('Delete customer error:', error);
        res.status(500).json({ message: 'Server error deleting customer' });
    }
};

module.exports = {
    getCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer
};
