const express = require('express');
const router = express.Router();
const {
    getSales,
    getSale,
    createSale,
    deleteSale
} = require('../controllers/salesController');
const { auth, staffAuth } = require('../middleware/auth');

// All authenticated users can create sales and view their own
router.get('/', auth, getSales);
router.get('/:id', auth, getSale);
router.post('/', auth, createSale);

// Only staff/admin can delete
router.delete('/:id', auth, staffAuth, deleteSale);

module.exports = router;
