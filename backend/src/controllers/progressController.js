const progressService = require('../services/progressService');
const { AppError } = require('../middleware/errorHandler');

const progressController = {
  // GET /progress or /progress/overview
  getProgress: async (req, res, next) => {
    try {
      const overview = await progressService.calculateOverallProgress(req.user.id);
      res.json({ overview });
    } catch (err) {
      next(err);
    }
  },

  // POST /progress/event
  updateProgress: async (req, res, next) => {
    try {
      const event = await progressService.trackEvent(req.user.id, 'progress', req.body);

      res.status(201).json({
        message: 'Progress event logged',
        event,
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /progress/analytics
  getAnalytics: async (req, res, next) => {
    try {
      const data = await progressService.generateAnalytics(
        req.user.id,
        req.query.timeframe || '30d'
      );

      res.json({ analytics: data });
    } catch (err) {
      next(err);
    }
  },

  // GET /progress/milestones
  getMilestones: async (req, res, next) => {
    try {
      const milestones = await progressService.checkMilestones(req.user.id);

      res.json({ milestones });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = progressController;
