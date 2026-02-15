const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    stockIn,
    stockOut
} = require('../controllers/productController');
const { auth, staffAuth } = require('../middleware/auth');

// Public/Customer routes
router.get('/', auth, getProducts);
router.get('/:id', auth, getProduct);

// Staff/Admin only routes
router.post('/', auth, staffAuth, createProduct);
router.put('/:id', auth, staffAuth, updateProduct);
router.delete('/:id', auth, staffAuth, deleteProduct);
router.post('/:id/stock-in', auth, staffAuth, stockIn);
router.post('/:id/stock-out', auth, staffAuth, stockOut);

module.exports = router;
