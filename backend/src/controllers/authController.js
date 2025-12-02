const authService = require('../services/authService');
const { AppError } = require('../middleware/errorHandler');

const authController = {
  // POST /auth/register
  register: async (req, res, next) => {
    try {
      const { email, password, firstName, lastName } = req.body;

      if (!email || !password || !firstName || !lastName) {
        throw new AppError('Missing required fields', 400, 'MISSING_FIELDS');
      }

      const result = await authService.register({
        email,
        password,
        firstName,
        lastName
      });

      res.status(201).json({
        message: 'User registered successfully',
        ...result
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /auth/login
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new AppError('Email and password are required', 400, 'MISSING_FIELDS');
      }

      const result = await authService.login(email, password);

      res.json({
        message: 'Login successful',
        ...result
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /auth/refresh
  refresh: async (req, res, next) => {
    try {
      const token = req.body.refreshToken || req.cookies.refreshToken;

      if (!token) {
        throw new AppError('Refresh token required', 400, 'NO_REFRESH_TOKEN');
      }

      const result = await authService.refreshToken(token);

      res.json({
        message: 'Token refreshed',
        ...result
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /auth/logout
  logout: async (req, res, next) => {
    try {
      const token = req.body.refreshToken || req.cookies.refreshToken;
      await authService.logout(token);

      res.json({ message: 'Logged out successfully' });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = authController;
