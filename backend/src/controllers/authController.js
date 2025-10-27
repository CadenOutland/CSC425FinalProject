const authService = require('../services/authService');
const { validateEmail, validatePassword } = require('../utils/validators');

const authController = {
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const result = await authService.login(email, password);

      // Set refresh token in HTTP-only cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({
        success: true,
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
        message: 'Login successful',
      });
    } catch (error) {
      next(error);
    }
  },

  register: async (req, res, next) => {
    try {
      const { email, password, fullName } = req.body;

      const result = await authService.register({
        email,
        password,
        fullName,
      });

      // Set refresh token in HTTP-only cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(201).json({
        success: true,
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
        message: 'Account created successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  logout: async (req, res, next) => {
    try {
      // Clear refresh token cookie
      res.clearCookie('refreshToken');

      res.json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  refreshToken: async (req, res, next) => {
    try {
      const refreshToken = req.cookies.refreshToken;

      const result = await authService.refreshToken(refreshToken);

      // Set new refresh token cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({
        success: true,
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
        message: 'Token refreshed successfully',
      });
    } catch (error) {
      // Clear refresh token cookie if there's an error
      if (
        error.message === 'Token reuse detected' ||
        error.message === 'Invalid refresh token'
      ) {
        res.clearCookie('refreshToken');
      }
      next(error);
    }
  },
};

module.exports = authController;
