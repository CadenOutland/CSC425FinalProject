const Progress = require('../models/Progress');
const Challenge = require('../models/Challenge');

const progressService = {
  // Calculate overall user progress as percentage of completed challenges / total challenges
  calculateOverallProgress: async (userId) => {
    // Get user stats from progress table
    const stats = await Progress.getUserStats(userId);

    // Get total number of active challenges (approximate denominator)
    const allChallenges = await Challenge.findAll();
    const totalChallenges = allChallenges.length || 0;

    const completed = Number(stats?.completed_challenges || 0);
    const percentage = totalChallenges > 0 ? Math.round((completed / totalChallenges) * 100) : 0;

    return {
      totalChallenges,
      completed,
      percentage,
      totalPoints: Number(stats?.total_points || 0),
      totalAttempts: Number(stats?.total_attempts || 0),
      averageScore: Number(stats?.average_score || 0),
    };
  },

  // Track event (basic create)
  trackEvent: async (userId, eventType, eventData) => {
    // For now, only accept 'progress' events and create a Progress entry
    if (eventType === 'progress') {
      const payload = {
        user_id: userId,
        challenge_id: eventData.challengeId,
        score: eventData.score || null,
        completed: eventData.completed || false,
        points_earned: eventData.points || 0,
        time_spent: eventData.timeSpent || 0,
      };
      return await Progress.create(payload);
    }

    throw new Error('Unsupported event type');
  },

  generateAnalytics: async (userId, timeframe) => {
    // Not implemented in depth
    return { message: 'Analytics not implemented' };
  },

  checkMilestones: async (userId) => {
    return { message: 'Milestones not implemented' };
  }
};

module.exports = progressService;