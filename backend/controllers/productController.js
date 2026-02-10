// Product controller placeholder

const getProducts = async (req, res) => {
    res.json({ message: 'Get products endpoint' });
};

const createProduct = async (req, res) => {
    res.json({ message: 'Create product endpoint' });
};

const updateProduct = async (req, res) => {
    res.json({ message: 'Update product endpoint' });
};

const deleteProduct = async (req, res) => {
    res.json({ message: 'Delete product endpoint' });
};

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };
