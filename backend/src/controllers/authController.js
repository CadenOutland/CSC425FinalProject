// Authentication controller: handles HTTP layer for auth actions
const authService = require('../services/authService');
const { AppError } = require('../middleware/errorHandler');

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  // maxAge set dynamically when issuing cookie
};

const setRefreshCookie = (res, token) => {
  if (!token) return;
  const ms = (() => {
    const v = process.env.JWT_REFRESH_EXPIRES_IN;
    if (!v) return 7 * 24 * 60 * 60 * 1000;
    if (/^\d+$/.test(v)) return parseInt(v, 10);
    if (v.endsWith('d')) return parseInt(v, 10) * 24 * 60 * 60 * 1000;
    if (v.endsWith('h')) return parseInt(v, 10) * 60 * 60 * 1000;
    return 7 * 24 * 60 * 60 * 1000;
  })();

  res.cookie('refreshToken', token, { ...COOKIE_OPTIONS, maxAge: ms });
};

const clearRefreshCookie = (res) => {
  res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'lax' });
};

const authController = {
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);

      setRefreshCookie(res, result.refreshToken);

      return res.status(200).json({
        status: 'success',
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    } catch (err) {
      return next(err);
    }
  },

  register: async (req, res, next) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      const result = await authService.register({
        email,
        password,
        firstName,
        lastName,
      });

      setRefreshCookie(res, result.refreshToken);

      return res.status(201).json({
        status: 'success',
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    } catch (err) {
      return next(err);
    }
  },

  logout: async (req, res, next) => {
    try {
      // Support token from cookie or body
      const token =
        req.cookies?.refreshToken ||
        req.body?.refreshToken ||
        req.headers['x-refresh-token'];
      await authService.logout(token);
      clearRefreshCookie(res);
      return res.status(204).send();
    } catch (err) {
      return next(err);
    }
  },

  refreshToken: async (req, res, next) => {
    try {
      const token =
        req.cookies?.refreshToken ||
        req.body?.refreshToken ||
        req.headers['x-refresh-token'];
      if (!token)
        throw new AppError(
          'No refresh token provided',
          400,
          'NO_REFRESH_TOKEN'
        );

      const result = await authService.refreshToken(token);

      // rotate cookie
      setRefreshCookie(res, result.refreshToken);

      return res.status(200).json({
        status: 'success',
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    } catch (err) {
      return next(err);
    }
  },
};

module.exports = authController;
