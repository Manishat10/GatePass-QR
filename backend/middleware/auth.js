const jwt = require('jsonwebtoken');

/**
 * Admin Authentication Middleware
 * 
 * This middleware protects routes that require admin privileges.
 * It validates JWT tokens and ensures the user has ADMIN role.
 * 
 * Security Flow:
 * 1. Extract token from Authorization header
 * 2. Verify token signature and expiration
 * 3. Check if user role is "ADMIN"
 * 4. Attach admin info to request object
 * 5. Return 403 if not admin or token invalid
 */
const authenticateAdmin = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    // Extract token from "Bearer <token>" format
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : authHeader;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token format.',
      });
    }

    // Verify token
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    const decoded = jwt.verify(token, jwtSecret);

    // Check if user has ADMIN role
    if (decoded.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.',
      });
    }

    // Attach admin info to request object
    req.admin = {
      email: decoded.email,
      role: decoded.role,
    };

    // Proceed to next middleware
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.',
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please login again.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Authentication error.',
      error: error.message,
    });
  }
};

module.exports = { authenticateAdmin };

