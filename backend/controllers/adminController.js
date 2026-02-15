const User = require('../models/User');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Sale = require('../models/Sale');

// Get all users (Admin only)
const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json({ success: true, count: users.length, users });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'Server error fetching users' });
    }
};

// Update user role (Admin only)
const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;

        if (!role || !['admin', 'staff'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = role;
        await user.save();

        res.json({
            success: true,
            message: 'User role updated',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Update user role error:', error);
        res.status(500).json({ message: 'Server error updating user role' });
    }
};

// Delete user (Admin only)
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent deleting yourself
        if (user._id.toString() === req.user.id) {
            return res.status(400).json({ message: 'Cannot delete your own account' });
        }

        await user.deleteOne();
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Server error deleting user' });
    }
};

// Get dashboard statistics (Admin only)
const getDashboard = async (req, res) => {
    try {
        // Get counts
        const totalProducts = await Product.countDocuments();
        const totalCustomers = await Customer.countDocuments();
        const totalSales = await Sale.countDocuments();
        const totalUsers = await User.countDocuments();

        // Get total revenue
        const salesData = await Sale.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalAmount' }
                }
            }
        ]);
        const totalRevenue = salesData.length > 0 ? salesData[0].totalRevenue : 0;

        // Get low stock products (quantity < 10)
        const lowStockProducts = await Product.find({ quantity: { $lt: 10 } })
            .select('name quantity')
            .limit(5);

        // Get recent sales
        const recentSales = await Sale.find()
            .populate('customerId', 'name')
            .populate('items.productId', 'name')
            .sort({ createdAt: -1 })
            .limit(5);

        // Get sales by month (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlySales = await Sale.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    totalAmount: { $sum: '$totalAmount' },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 }
            }
        ]);

        res.json({
            success: true,
            dashboard: {
                overview: {
                    totalProducts,
                    totalCustomers,
                    totalSales,
                    totalUsers,
                    totalRevenue
                },
                lowStockProducts,
                recentSales,
                monthlySales
            }
        });
    } catch (error) {
        console.error('Get dashboard error:', error);
        res.status(500).json({ message: 'Server error fetching dashboard data' });
    }
};

// Get reports
const getReports = async (req, res) => {
    try {
        const { type, startDate, endDate } = req.query;

        let query = {};
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        let report = {};

        if (type === 'sales' || !type) {
            const sales = await Sale.find(query)
                .populate('customerId', 'name')
                .populate('items.productId', 'name category');

            const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);

            report.sales = {
                count: sales.length,
                totalRevenue,
                sales
            };
        }

        if (type === 'inventory' || !type) {
            const products = await Product.find();
            const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);

            report.inventory = {
                totalProducts: products.length,
                totalValue,
                lowStock: products.filter(p => p.quantity < 10).length,
                outOfStock: products.filter(p => p.quantity === 0).length
            };
        }

        if (type === 'customers' || !type) {
            const customers = await Customer.countDocuments();
            report.customers = { totalCustomers: customers };
        }

        res.json({ success: true, report });
    } catch (error) {
        console.error('Get reports error:', error);
        res.status(500).json({ message: 'Server error generating reports' });
    }
};

module.exports = {
    getUsers,
    updateUserRole,
    deleteUser,
    getDashboard,
    getReports
};
