const progressService = require('../services/progressService');

const progressController = {
  getProgress: async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: 'Unauthorized' });

      const overview = await progressService.calculateOverallProgress(userId);
      return res.json({ data: overview });
    } catch (error) {
      next(error);
    }
  },

  updateProgress: async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: 'Unauthorized' });
      const payload = req.body || {};
      const created = await progressService.trackEvent(userId, 'progress', payload);
      return res.status(201).json({ data: created });
    } catch (error) {
      next(error);
    }
  },

  getAnalytics: async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: 'Unauthorized' });
      const timeframe = req.query.timeframe || '30d';
      const analytics = await progressService.generateAnalytics(userId, timeframe);
      return res.json({ data: analytics });
    } catch (error) {
      next(error);
    }
  },

  getMilestones: async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: 'Unauthorized' });
      const milestones = await progressService.checkMilestones(userId);
      return res.json({ data: milestones });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = progressController;