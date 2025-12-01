// Authentication business logic using MongoDB (Mongoose)
const jwtUtils = require('../utils/jwt');
const bcrypt = require('bcryptjs');
const { AppError } = require('../middleware/errorHandler');
const mongo = require('../database/mongo');
const User = require('../models/MongoUser');
const RefreshToken = require('../models/MongoRefreshToken');

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
    // Ensure mongoose connected
    if (!mongo.mongoose.connection.readyState) {
      await mongo.connect();
    }

    const user = await User.findOne({ email: email.toLowerCase() }).lean();
    if (!user)
      throw new AppError(
        'Incorrect email or password',
        401,
        'INVALID_CREDENTIALS'
      );

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
    const refreshToken = jwtUtils.generateRefreshToken({ id: user.id });

    // Compute expiry for refresh token
    const ms = parseExpiryToMs(process.env.JWT_REFRESH_EXPIRES_IN);
    const expiresAt = new Date(Date.now() + ms);

    // Store refresh token in MongoDB
    await RefreshToken.create({
      token: refreshToken,
      user: user._id || user.id,
      expires_at: expiresAt,
    });

    // Update last_login timestamp
    try {
      await User.updateOne(
        { _id: user._id || user.id },
        { last_login: new Date() }
      );
    } catch (e) {
      // non-fatal
    }

    // Return minimal user info and tokens
    return {
      user: {
        id: user._id || user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  },

  // Register a new user and return tokens
  register: async (userData) => {
    const { email, password, firstName, lastName } = userData;
    // Ensure mongoose connected
    if (!mongo.mongoose.connection.readyState) {
      await mongo.connect();
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing)
      throw new AppError('Email already in use', 400, 'EMAIL_EXISTS');

    const passwordHash = await bcrypt.hash(password, 12);

    const created = await User.create({
      email: email.toLowerCase(),
      password_hash: passwordHash,
      first_name: firstName,
      last_name: lastName,
    });

    const user = created.toObject();

    // Generate tokens
    const accessToken = jwtUtils.generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = jwtUtils.generateRefreshToken({ id: user._id });

    const ms = parseExpiryToMs(process.env.JWT_REFRESH_EXPIRES_IN);
    const expiresAt = new Date(Date.now() + ms);

    await RefreshToken.create({
      token: refreshToken,
      user: user._id,
      expires_at: expiresAt,
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
