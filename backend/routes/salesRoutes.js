const express = require('express');
const router = express.Router();
const { getSales, createSale } = require('../controllers/salesController');
const { auth } = require('../middleware/auth');

router.get('/', auth, getSales);
router.post('/', auth, createSale);

module.exports = router;
