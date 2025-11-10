// backend/src/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// helpers (simple)
const makeAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'dev-jwt-secret',
    { expiresIn: '1h' }
  );
};

const makeRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
    { expiresIn: '7d' }
  );
};

exports.register = async (req, res, next) => {
  try {
    const { email, password, confirmPassword, firstName, lastName } = req.body;

    if (!email || !password || !confirmPassword || !firstName || !lastName) {
      return res.status(400).json({
        status: 'fail',
        message: 'Validation error: Required fields are missing',
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ status: 'fail', message: 'Passwords do not match' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ status: 'fail', message: 'User already exists' });
    }

    const user = new User({ email, password, firstName, lastName });
    await user.save();

    const accessToken = makeAccessToken(user);
    const refreshToken = makeRefreshToken(user);

    // set refresh cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      status: 'success',
      data: { user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName }, accessToken },
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ status: 'fail', message: 'Email and password required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ status: 'fail', message: 'Invalid credentials' });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ status: 'fail', message: 'Invalid credentials' });
    }

    const accessToken = makeAccessToken(user);
    const refreshToken = makeRefreshToken(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      status: 'success',
      data: { user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName }, accessToken },
    });
  } catch (err) {
    next(err);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken || req.body.refreshToken;
    if (!token) return res.status(401).json({ status: 'fail', message: 'No refresh token' });
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret');
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ status: 'fail', message: 'Invalid token' });

    const accessToken = makeAccessToken(user);
    return res.json({ status: 'success', accessToken });
  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res) => {
  res.clearCookie('refreshToken');
  return res.json({ status: 'success', message: 'Logged out' });
};
