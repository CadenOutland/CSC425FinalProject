// TODO: Implement leaderboard controller for rankings and points
const leaderboardService = require('../services/leaderboardService');

const leaderboardController = {
  // Get global leaderboard
  getLeaderboard: async (req, res, next) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const data = await leaderboardService.getGlobal(limit);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  // Get user ranking
  getUserRanking: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const data = await leaderboardService.getUserRank(userId);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  },

  // Get points breakdown (placeholder)
  getPointsBreakdown: async (req, res, next) => {
    res.json({ success: true, data: { message: 'Not implemented' } });
  },

  // Get achievements (placeholder)
  getAchievements: async (req, res, next) => {
    res.json({ success: true, data: [] });
  },
};

module.exports = leaderboardController;
