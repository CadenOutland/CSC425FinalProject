const userService = require('../services/userService');
const { AppError } = require('../middleware/errorHandler');

const userController = {
  // GET /users/profile
  getProfile: async (req, res, next) => {
    try {
      const user = await userService.getUserById(req.user.id);

      if (!user) throw new AppError('User not found', 404);

      res.json({
        message: 'Profile fetched',
        user
      });
    } catch (err) {
      next(err);
    }
  },

  // PUT /users/profile
  updateProfile: async (req, res, next) => {
    try {
      const updated = await userService.updateProfile(req.user.id, req.body);

      res.json({
        message: 'Profile updated',
        user: updated
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /users/statistics
  getStatistics: async (req, res, next) => {
    try {
      const stats = await userService.getUserStats(req.user.id);

      res.json({
        message: 'Statistics fetched',
        stats
      });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /users/account
  deleteAccount: async (req, res, next) => {
    try {
      await userService.deleteUser(req.user.id);

      res.json({ message: 'Account deleted' });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = userController;

