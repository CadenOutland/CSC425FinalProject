const jwt = require('../utils/jwt');
const { AppError } = require('./errorHandler');
const db = require('../database/connection');

/**
 * Authentication middleware to protect routes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const auth = async (req, res, next) => {
  try {
    // Get token from Authorization header
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return next(
        new AppError(
          'Authentication required. Please log in.',
          401,
          'AUTH_TOKEN_MISSING'
        )
      );
    }

    // Verify token
    const decoded = jwt.verifyAccessToken(token);
    if (!decoded) {
      return next(
        new AppError('Invalid authentication token.', 401, 'AUTH_TOKEN_INVALID')
      );
    }

    // Check if user still exists in database
    const user = await db.query('SELECT id, email FROM users WHERE id = $1', [
      decoded.userId,
    ]);
    if (!user.rows[0]) {
      return next(
        new AppError('User account no longer exists.', 401, 'USER_NOT_FOUND')
      );
    }

    // Add user info to request
    req.user = {
      id: user.rows[0].id,
      email: user.rows[0].email,
      ...decoded,
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(
        new AppError(
          'Authentication token has expired.',
          401,
          'AUTH_TOKEN_EXPIRED'
        )
      );
    }
    return next(error);
  }
};

/**
 * Authorization middleware to restrict access by user role
 * @param {...string} roles - Allowed roles for the route
 * @returns {Function} Express middleware function
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          'Insufficient permissions for this action.',
          403,
          'INSUFFICIENT_PERMISSIONS'
        )
      );
    }
    next();
  };
};

module.exports = auth;
module.exports.restrictTo = restrictTo;
