const jwt = require('../utils/jwt');
const bcrypt = require('bcryptjs');
const db = require('../database/connection');
const { validateEmail, validatePassword } = require('../utils/validators');

const SALT_ROUNDS = 10;

const authService = {
  login: async (email, password) => {
    // Validate input
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    if (!validateEmail(email)) {
      throw new Error('Invalid email format');
    }

    // Get user from database
    const user = await db.query('SELECT * FROM users WHERE email = $1', [
      email.toLowerCase(),
    ]);

    if (!user.rows[0]) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(
      password,
      user.rows[0].password_hash
    );
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate tokens
    const accessToken = jwt.generateAccessToken(user.rows[0].id);
    const refreshToken = jwt.generateRefreshToken(user.rows[0].id);

    // Store refresh token in database
    await db.query(
      'INSERT INTO refresh_tokens (user_id, token) VALUES ($1, $2)',
      [user.rows[0].id, refreshToken]
    );

    return {
      user: {
        id: user.rows[0].id,
        email: user.rows[0].email,
        fullName: user.rows[0].full_name,
        createdAt: user.rows[0].created_at,
      },
      accessToken,
      refreshToken,
    };
  },

  register: async (userData) => {
    const { email, password, fullName } = userData;

    // Validate input
    if (!email || !password || !fullName) {
      throw new Error('Email, password, and full name are required');
    }

    if (!validateEmail(email)) {
      throw new Error('Invalid email format');
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors[0]);
    }

    // Check if user already exists
    const existingUser = await db.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUser.rows[0]) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const newUser = await db.query(
      'INSERT INTO users (email, password_hash, full_name) VALUES ($1, $2, $3) RETURNING id, email, full_name, created_at',
      [email.toLowerCase(), passwordHash, fullName]
    );

    // Generate tokens
    const accessToken = jwt.generateAccessToken(newUser.rows[0].id);
    const refreshToken = jwt.generateRefreshToken(newUser.rows[0].id);

    // Store refresh token
    await db.query(
      'INSERT INTO refresh_tokens (user_id, token) VALUES ($1, $2)',
      [newUser.rows[0].id, refreshToken]
    );

    // Initialize user statistics
    await db.query('INSERT INTO user_statistics (user_id) VALUES ($1)', [
      newUser.rows[0].id,
    ]);

    return {
      user: {
        id: newUser.rows[0].id,
        email: newUser.rows[0].email,
        fullName: newUser.rows[0].full_name,
        createdAt: newUser.rows[0].created_at,
      },
      accessToken,
      refreshToken,
    };
  },

  refreshToken: async (refreshToken) => {
    if (!refreshToken) {
      throw new Error('Refresh token is required');
    }

    // Verify refresh token
    const payload = jwt.verifyRefreshToken(refreshToken);
    if (!payload) {
      throw new Error('Invalid refresh token');
    }

    // Check if token exists and is not revoked in database
    const token = await db.query(
      'SELECT rt.*, u.email, u.full_name FROM refresh_tokens rt ' +
        'JOIN users u ON u.id = rt.user_id ' +
        'WHERE rt.token = $1 AND rt.user_id = $2 AND rt.revoked = false',
      [refreshToken, payload.userId]
    );

    if (!token.rows[0]) {
      throw new Error('Invalid refresh token');
    }

    // Check token family for reuse detection
    const tokenFamily = await db.query(
      'SELECT COUNT(*) FROM refresh_tokens ' +
        'WHERE user_id = $1 AND created_at > $2',
      [payload.userId, token.rows[0].created_at]
    );

    // If newer tokens exist, this might be a reuse attempt
    if (parseInt(tokenFamily.rows[0].count) > 0) {
      // Revoke all tokens for this user as a security measure
      await db.query(
        'UPDATE refresh_tokens SET revoked = true WHERE user_id = $1',
        [payload.userId]
      );
      throw new Error('Token reuse detected');
    }

    // Generate new tokens
    const newAccessToken = jwt.generateAccessToken(payload.userId);
    const newRefreshToken = jwt.generateRefreshToken(payload.userId);

    // Store new refresh token and revoke old one (rotation)
    await db.query(
      'UPDATE refresh_tokens SET revoked = true WHERE token = $1',
      [refreshToken]
    );

    await db.query(
      'INSERT INTO refresh_tokens (user_id, token) VALUES ($1, $2)',
      [payload.userId, newRefreshToken]
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: {
        id: payload.userId,
        email: token.rows[0].email,
        fullName: token.rows[0].full_name,
      },
    };
  },

  resetPassword: async (email) => {
    if (!email || !validateEmail(email)) {
      throw new Error('Valid email is required');
    }

    const user = await db.query('SELECT id FROM users WHERE email = $1', [
      email.toLowerCase(),
    ]);

    if (!user.rows[0]) {
      // Don't reveal if user exists
      return {
        message: 'If an account exists, a password reset email will be sent',
      };
    }

    // Generate reset token
    const resetToken = jwt.generateResetToken(user.rows[0].id);

    // TODO: Implement email service integration
    // For now, just return the token
    return { resetToken };
  },
};

module.exports = authService;
