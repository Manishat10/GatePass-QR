const Labour = require('../models/Labour');
const QRCode = require('qrcode');
const path = require('path');

/**
 * Register a new labour
 * POST /api/labour/register
 */
exports.registerLabour = async (req, res) => {
  try {
    const { name, phone, email, governmentId } = req.body;
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : '';

    // Validate required fields
    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name and phone number are required',
      });
    }

    // Check if phone number already exists
    const existingLabour = await Labour.findOne({ phone });
    if (existingLabour) {
      return res.status(400).json({
        success: false,
        message: 'Labour with this phone number already exists',
      });
    }

    // Create new labour record
    const labour = new Labour({
      name,
      phone,
      email: email || '',
      photoUrl,
      governmentId: governmentId || '',
      verificationStatus: 'PENDING',
    });

    await labour.save();

    /**
     * QR Code Generation with Full URL
     * 
     * Why URL-based QR instead of just labourId?
     * - When scanned, QR codes with URLs automatically open in browser
     * - Provides seamless user experience (no manual copy-paste needed)
     * - Works across different QR scanner apps
     * - Direct navigation to verification page
     * 
     * Security: QR contains ONLY the labourId in the URL path
     * - No personal data (name, phone, email) is encoded in QR
     * - Personal data is fetched securely from backend after scanning
     * - Frontend base URL is configurable via environment variable
     */
    const frontendBaseUrl = process.env.FRONTEND_BASE_URL || 'http://localhost:3000';
    const verificationUrl = `${frontendBaseUrl}/verify/${labour._id.toString()}`;
    
    // Generate QR code with full verification URL
    const qrCodeBase64 = await QRCode.toDataURL(verificationUrl, {
      errorCorrectionLevel: 'H', // High error correction for better scanning
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      width: 300,
    });

    res.status(201).json({
      success: true,
      message: 'Labour registered successfully',
      data: {
        labourId: labour._id,
        qrCode: qrCodeBase64,
        labour: {
          name: labour.name,
          phone: labour.phone,
          email: labour.email,
          photoUrl: labour.photoUrl,
          verificationStatus: labour.verificationStatus,
        },
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register labour',
      error: error.message,
    });
  }
};

/**
 * Get labour details by ID
 * GET /api/labour/:labourId
 */
exports.getLabourById = async (req, res) => {
  try {
    const { labourId } = req.params;

    if (!labourId) {
      return res.status(400).json({
        success: false,
        message: 'Labour ID is required',
      });
    }

    const labour = await Labour.findById(labourId);

    if (!labour) {
      return res.status(404).json({
        success: false,
        message: 'Labour not found',
      });
    }

    res.json({
      success: true,
      data: {
        labourId: labour._id,
        name: labour.name,
        phone: labour.phone,
        email: labour.email,
        photoUrl: labour.photoUrl,
        governmentId: labour.governmentId,
        verificationStatus: labour.verificationStatus,
        verifiedAt: labour.verifiedAt,
        createdAt: labour.createdAt,
      },
    });
  } catch (error) {
    console.error('Get labour error:', error);
    
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid labour ID format',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to fetch labour details',
      error: error.message,
    });
  }
};

/**
 * Verify a labour
 * PUT /api/labour/:labourId/verify
 */
exports.verifyLabour = async (req, res) => {
  try {
    const { labourId } = req.params;

    if (!labourId) {
      return res.status(400).json({
        success: false,
        message: 'Labour ID is required',
      });
    }

    const labour = await Labour.findById(labourId);

    if (!labour) {
      return res.status(404).json({
        success: false,
        message: 'Labour not found',
      });
    }

    // Update verification status
    labour.verificationStatus = 'VERIFIED';
    labour.verifiedAt = new Date();

    await labour.save();

    res.json({
      success: true,
      message: 'Labour verified successfully',
      data: {
        labourId: labour._id,
        name: labour.name,
        phone: labour.phone,
        verificationStatus: labour.verificationStatus,
        verifiedAt: labour.verifiedAt,
      },
    });
  } catch (error) {
    console.error('Verification error:', error);
    
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid labour ID format',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to verify labour',
      error: error.message,
    });
  }
};

