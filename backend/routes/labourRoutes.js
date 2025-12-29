const express = require('express');
const router = express.Router();
const labourController = require('../controllers/labourController');
const upload = require('../middleware/upload');
const { authenticateAdmin } = require('../middleware/auth');

/**
 * @route   POST /api/labour/register
 * @desc    Register a new labour and generate QR code
 * @access  Public
 */
router.post('/register', upload.single('photo'), labourController.registerLabour);

/**
 * @route   GET /api/labour/:labourId
 * @desc    Get labour details by ID
 * @access  Public
 */
router.get('/:labourId', labourController.getLabourById);

/**
 * @route   PUT /api/labour/:labourId/verify
 * @desc    Mark labour as verified
 * @access  Protected (Admin only)
 * 
 * Security: This endpoint requires admin authentication.
 * Only users with ADMIN role can verify labour.
 * Backend enforces this - frontend hiding button is not enough.
 */
router.put('/:labourId/verify', authenticateAdmin, labourController.verifyLabour);

module.exports = router;

