const Progress = require('../models/Progress');
const Challenge = require('../models/Challenge');

const progressService = {

  calculateOverallProgress: async (userId) => {
    const stats = await Progress.getUserStats(userId);
    const challenges = await Challenge.findAll();

    const completed = Number(stats?.completed_challenges || 0);
    const total = challenges.length;

    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      totalChallenges: total,
      completed,
      percentage,
      totalPoints: Number(stats?.total_points || 0),
      totalAttempts: Number(stats?.total_attempts || 0),
      averageScore: Number(stats?.average_score || 0)
    };
  },

  trackEvent: async (userId, eventType, eventData) => {
    if (eventType !== 'progress')
      throw new Error('Unsupported event type');

    const payload = {
      user_id: userId,
      challenge_id: eventData.challengeId,
      score: eventData.score || null,
      completed: eventData.completed || false,
      points_earned: eventData.points || 0,
      time_spent: eventData.timeSpent || 0
    };

    return await Progress.create(payload);
  },

  generateAnalytics: async () => {
    return { message: 'Analytics not implemented' };
  },

  checkMilestones: async () => {
    return { message: 'Milestones not implemented' };
  }
};

module.exports = progressService;
