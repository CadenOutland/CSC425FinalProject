const leaderboardService = require('../services/leaderboardService');
const { AppError } = require('../middleware/errorHandler');

const leaderboardController = {
  // GET /leaderboard
  getLeaderboard: async (req, res, next) => {
    try {
      const list = await leaderboardService.calculateRankings('all');
      res.json({ leaderboard: list });
    } catch (err) {
      next(err);
    }
  },

  // GET /leaderboard/ranking
  getUserRanking: async (req, res, next) => {
    try {
      const ranking = await leaderboardService.calculateRankings('all');

      const position = ranking.findIndex(r => r.user_id === req.user.id) + 1;

      res.json({ rank: position || null });
    } catch (err) {
      next(err);
    }
  },

  // GET /leaderboard/points
  getPointsBreakdown: async (req, res, next) => {
    try {
      const stats = await leaderboardService.getTopPerformers(50);
      res.json({ stats });
    } catch (err) {
      next(err);
    }
  },

  // GET /leaderboard/achievements
  getAchievements: async (req, res, next) => {
    try {
      const achievements = await leaderboardService.getAchievements?.(req.user.id);

      res.json({ achievements });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = leaderboardController;

