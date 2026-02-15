const express = require('express');
const router = express.Router();
const {
    getCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer
} = require('../controllers/customerController');
const { auth, staffAuth } = require('../middleware/auth');

// Staff/Admin only routes
router.get('/', auth, staffAuth, getCustomers);
router.get('/:id', auth, staffAuth, getCustomer);
router.post('/', auth, staffAuth, createCustomer);
router.put('/:id', auth, staffAuth, updateCustomer);
router.delete('/:id', auth, staffAuth, deleteCustomer);

module.exports = router;
