const jwt = require('jsonwebtoken');

/**
 * Admin Login Controller
 * 
 * Handles admin authentication with hardcoded credentials.
 * In production, this should be replaced with database lookup.
 * 
 * Admin Credentials (hardcoded for now):
 * - Email: test@gmail.com
 * - Password: Test@123
 */
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Hardcoded admin credentials
    // TODO: Replace with database lookup in production
    const ADMIN_EMAIL = 'test@gmail.com';
    const ADMIN_PASSWORD = 'Test@123';

    // Verify credentials
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    const token = jwt.sign(
      {
        email: ADMIN_EMAIL,
        role: 'ADMIN',
      },
      jwtSecret,
      {
        expiresIn: '24h', // Token expires in 24 hours
      }
    );

    res.json({
      success: true,
      message: 'Admin login successful',
      data: {
        token,
        admin: {
          email: ADMIN_EMAIL,
          role: 'ADMIN',
        },
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process login',
      error: error.message,
    });
  }
};

/**
 * Verify Admin Token
 * 
 * Endpoint to verify if current token is valid and user is admin
 */
exports.verifyAdminToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : authHeader;

    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    const decoded = jwt.verify(token, jwtSecret);

    if (decoded.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not an admin user',
      });
    }

    res.json({
      success: true,
      message: 'Token is valid',
      data: {
        admin: {
          email: decoded.email,
          role: decoded.role,
        },
      },
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Token verification failed',
      error: error.message,
    });
  }
};

