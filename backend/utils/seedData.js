const User = require('../models/User');
const Product = require('../models/Product');
const bcrypt = require('bcryptjs');

const seedDefaultAdmin = async () => {
    try {
        // Check if admin already exists
        const adminExists = await User.findOne({ role: 'admin' });

        if (!adminExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);

            await User.create({
                name: 'System Admin',
                email: 'admin@sisms.com',
                password: hashedPassword,
                role: 'admin'
            });

            console.log('✅ Default admin created:');
            console.log('   Email: admin@sisms.com');
            console.log('   Password: admin123');
        }
    } catch (error) {
        console.error('Error creating default admin:', error);
    }
};

const seedDefaultProducts = async () => {
    try {
        const productCount = await Product.countDocuments();

        if (productCount === 0) {
            const defaultProducts = [
                { name: 'Laptop', category: 'Electronics', price: 999.99, quantity: 50 },
                { name: 'Wireless Mouse', category: 'Electronics', price: 29.99, quantity: 100 },
                { name: 'Keyboard', category: 'Electronics', price: 79.99, quantity: 75 },
                { name: 'Monitor', category: 'Electronics', price: 299.99, quantity: 30 },
                { name: 'USB Cable', category: 'Accessories', price: 9.99, quantity: 200 },
                { name: 'Headphones', category: 'Electronics', price: 149.99, quantity: 60 },
                { name: 'Webcam', category: 'Electronics', price: 89.99, quantity: 40 },
                { name: 'Desk Lamp', category: 'Furniture', price: 39.99, quantity: 80 },
                { name: 'Office Chair', category: 'Furniture', price: 249.99, quantity: 25 },
                { name: 'Notebook', category: 'Stationery', price: 4.99, quantity: 150 }
            ];

            await Product.insertMany(defaultProducts);
            console.log('✅ Default products seeded');
        }
    } catch (error) {
        console.error('Error seeding products:', error);
    }
};

const seedDatabase = async () => {
    await seedDefaultAdmin();
    await seedDefaultProducts();
};

module.exports = { seedDatabase };
