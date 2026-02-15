const express = require('express');
const router = express.Router();
const {
    getUsers,
    updateUserRole,
    deleteUser,
    getDashboard,
    getReports
} = require('../controllers/adminController');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/users', auth, adminAuth, getUsers);
router.put('/users/:id/role', auth, adminAuth, updateUserRole);
router.delete('/users/:id', auth, adminAuth, deleteUser);
router.get('/dashboard', auth, adminAuth, getDashboard);
router.get('/reports', auth, adminAuth, getReports);

module.exports = router;
