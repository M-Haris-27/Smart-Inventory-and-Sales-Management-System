const express = require('express');
const router = express.Router();
const {
    getUsers,
    createUser,
    updateUserRole,
    deleteUser,
    getDashboard,
    getReports
} = require('../controllers/adminController');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/users', auth, adminAuth, getUsers);
router.post('/users', auth, adminAuth, createUser);
router.put('/users/:id/role', auth, adminAuth, updateUserRole);
router.delete('/users/:id', auth, adminAuth, deleteUser);
router.get('/dashboard', auth, adminAuth, getDashboard);
router.get('/reports', auth, adminAuth, getReports);

module.exports = router;
