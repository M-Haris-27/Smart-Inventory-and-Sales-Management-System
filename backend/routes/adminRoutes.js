const express = require('express');
const router = express.Router();
const { getUsers, getDashboard } = require('../controllers/adminController');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/users', auth, adminAuth, getUsers);
router.get('/dashboard', auth, adminAuth, getDashboard);

module.exports = router;
