const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateAdmin } = require('../middleware/auth');

/**
 * @route   POST /api/auth/admin/login
 * @desc    Admin login endpoint
 * @access  Public
 */
router.post('/admin/login', authController.adminLogin);

/**
 * @route   GET /api/auth/admin/verify
 * @desc    Verify admin token
 * @access  Protected (Admin only)
 */
router.get('/admin/verify', authenticateAdmin, authController.verifyAdminToken);

module.exports = router;

