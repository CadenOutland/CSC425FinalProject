const jwt = require('jsonwebtoken');

// JWT secrets from environment variables with fallbacks
const JWT_SECRET = process.env.JWT_SECRET || 'your-access-token-secret';
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || 'your-refresh-token-secret';
const JWT_RESET_SECRET =
  process.env.JWT_RESET_SECRET || 'your-reset-token-secret';

// Token expiration times from environment variables with fallbacks
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
const JWT_RESET_EXPIRES_IN = process.env.JWT_RESET_EXPIRES_IN || '1h';

/**
 * Generate an access token for a user
 * @param {string} userId - The ID of the user
 * @returns {string} The generated JWT token
 */
const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

/**
 * Generate a refresh token for a user
 * @param {string} userId - The ID of the user
 * @returns {string} The generated refresh token
 */
const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  });
};

/**
 * Generate a password reset token for a user
 * @param {string} userId - The ID of the user
 * @returns {string} The generated reset token
 */
const generateResetToken = (userId) => {
  return jwt.sign({ userId }, JWT_RESET_SECRET, {
    expiresIn: JWT_RESET_EXPIRES_IN,
  });
};

/**
 * Verify an access token
 * @param {string} token - The token to verify
 * @returns {Object|null} The decoded token payload or null if invalid
 */
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Verify a refresh token
 * @param {string} token - The token to verify
 * @returns {Object|null} The decoded token payload or null if invalid
 */
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Verify a reset token
 * @param {string} token - The token to verify
 * @returns {Object|null} The decoded token payload or null if invalid
 */
const verifyResetToken = (token) => {
  try {
    return jwt.verify(token, JWT_RESET_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Decode a token without verifying it
 * @param {string} token - The token to decode
 * @returns {Object|null} The decoded token payload
 */
const decodeToken = (token) => {
  return jwt.decode(token);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
  verifyAccessToken,
  verifyRefreshToken,
  verifyResetToken,
  decodeToken,
};
