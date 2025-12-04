// TODO: Implement user management controller for profile, settings, statistics
const userService = require('../services/userService');
const { AppError } = require('../middleware/errorHandler');

const userController = {
  // Get user profile
  getProfile: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const profile = await userService.getUserProfile(userId);
      
      if (!profile) {
        throw new AppError('Profile not found', 404);
      }

      res.json({
        status: 'success',
        data: { profile }
      });
    } catch (error) {
      next(error);
    }
  },

  // Update user profile
  updateProfile: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const updateData = req.body;

      const updatedProfile = await userService.updateUserProfile(userId, updateData);

      res.json({
        status: 'success',
        data: { profile: updatedProfile }
      });
    } catch (error) {
      next(error);
    }
  },

  // Get user statistics
  getStatistics: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const stats = await userService.getUserStatistics(userId);

      res.json({
        status: 'success',
        data: { statistics: stats }
      });
    } catch (error) {
      next(error);
    }
  },

  // Delete user account
  deleteAccount: async (req, res, next) => {
    try {
      const userId = req.user.id;
      await userService.deleteUserAccount(userId);

      res.json({
        status: 'success',
        message: 'Account deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userController;
