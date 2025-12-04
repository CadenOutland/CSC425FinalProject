
// Authentication business logic using PostgreSQL
const jwtUtils = require('../utils/jwt');
const bcrypt = require('bcryptjs');
const { AppError } = require('../middleware/errorHandler');
const pool = require('../database/connection');


const parseExpiryToMs = (expiry) => {
  if (!expiry) return 7 * 24 * 60 * 60 * 1000; // default 7 days
  // Support formats like '7d', '24h', or milliseconds as number string
  if (/^\d+$/.test(expiry)) return parseInt(expiry, 10);
  if (expiry.endsWith('d')) return parseInt(expiry, 10) * 24 * 60 * 60 * 1000;
  if (expiry.endsWith('h')) return parseInt(expiry, 10) * 60 * 60 * 1000;
  if (expiry.endsWith('m')) return parseInt(expiry, 10) * 60 * 1000;
  return 7 * 24 * 60 * 60 * 1000;
};

const authService = {
  // Login a user: validate credentials, return access + refresh tokens
  login: async (email, password) => {

    // Query user from PostgreSQL
    const query = 'SELECT * FROM users WHERE email = $1 AND is_active = true';
    const result = await pool.query(query, [email.toLowerCase()]);
    const user = result.rows[0];
    if (!user) {
      throw new AppError(
        'Incorrect email or password',
        401,
        'INVALID_CREDENTIALS'
      );
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      throw new AppError(
        'Incorrect email or password',
        401,
        'INVALID_CREDENTIALS'
      );
    }

    const accessToken = jwtUtils.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    // For now, just return a dummy refresh token (implement refresh logic as needed)
    const refreshToken = jwtUtils.generateRefreshToken({ id: user.id });

    return { accessToken, refreshToken, user };
  },

  // Register a new user and return tokens
  register: async (userData) => {
    const { email, password, firstName, lastName } = userData;

    // Check if user already exists in PostgreSQL
    const existingQuery = 'SELECT * FROM users WHERE email = $1';
    const existingResult = await pool.query(existingQuery, [email.toLowerCase()]);
    if (existingResult.rows.length > 0) {
      throw new AppError('Email already in use', 400, 'EMAIL_EXISTS');
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const insertQuery = `
      INSERT INTO users (email, password_hash, first_name, last_name, is_active, is_verified, role)
      VALUES ($1, $2, $3, $4, true, false, 'student')
      RETURNING *
    `;
    const insertResult = await pool.query(insertQuery, [
      email.toLowerCase(),
      passwordHash,
      firstName,
      lastName
    ]);
    const user = insertResult.rows[0];

    // Generate tokens
    const accessToken = jwtUtils.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = jwtUtils.generateRefreshToken({ id: user.id });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  },

  // Refresh access token (rotates refresh token)
  refreshToken: async (token) => {
    // Verify token validity first
    let payload;
    try {
      payload = jwtUtils.verifyRefreshToken(token);
    } catch (err) {
      throw new AppError('Invalid refresh token', 401, 'INVALID_REFRESH');
    }

    // Ensure mongoose connected
    if (!mongo.mongoose.connection.readyState) {
      await mongo.connect();
    }

    const record = await RefreshToken.findOne({ token }).populate('user');
    if (!record)
      throw new AppError('Refresh token not found', 401, 'INVALID_REFRESH');
    if (record.is_revoked)
      throw new AppError('Refresh token revoked', 401, 'REVOKED_REFRESH');
    if (new Date(record.expires_at) <= new Date())
      throw new AppError('Refresh token expired', 401, 'EXPIRED_REFRESH');

    // Rotate: generate new refresh token and update record
    const newRefreshToken = jwtUtils.generateRefreshToken({ id: payload.id });
    const ms = parseExpiryToMs(process.env.JWT_REFRESH_EXPIRES_IN);
    const newExpiry = new Date(Date.now() + ms);

    record.token = newRefreshToken;
    record.expires_at = newExpiry;
    await record.save();

    const user = record.user;
    if (!user)
      throw new AppError(
        'User not found for refresh token',
        404,
        'USER_NOT_FOUND'
      );

    const accessToken = jwtUtils.generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      },
      accessToken,
      refreshToken: newRefreshToken,
    };
  },

  // Logout: revoke a refresh token
  logout: async (token) => {
    if (!token) return;
    if (!mongo.mongoose.connection.readyState) await mongo.connect();
    await RefreshToken.updateOne({ token }, { is_revoked: true });
  },
};

module.exports = authService;
