const Progress = require('../models/Progress');
const Challenge = require('../models/Challenge');
const pool = require('../database/connection');

const progressService = {
  // Calculate overall user progress as percentage of completed challenges / total challenges
  calculateOverallProgress: async (userId) => {
    // Get user stats from user_statistics table
    const statsQuery = `
      SELECT 
        total_points,
        total_challenges_completed,
        average_score
      FROM user_statistics
      WHERE user_id = $1
    `;
    const statsResult = await pool.query(statsQuery, [userId]);
    const stats = statsResult.rows[0] || {
      total_points: 0,
      total_challenges_completed: 0,
      average_score: 0,
    };

    // Trust source of truth for goals completed: goals table (is_completed)
    const goalsCompletedQuery = `
      SELECT COUNT(*)::int AS goals_completed
      FROM goals
      WHERE user_id = $1 AND is_completed = true
    `;
    const goalsCompletedResult = await pool.query(goalsCompletedQuery, [userId]);
    const goalsCompleted = goalsCompletedResult.rows[0]?.goals_completed || 0;

    // Get total number of active challenges (approximate denominator)
    const allChallenges = await Challenge.findAll();
    const totalChallenges = allChallenges.length || 0;

    const completed = Number(stats?.total_challenges_completed || 0);
    const percentage =
      totalChallenges > 0 ? Math.round((completed / totalChallenges) * 100) : 0;

    // Calculate level based on total points (100 points per level)
    const totalPoints = Number(stats?.total_points || 0);
    const level = Math.floor(totalPoints / 100) + 1;
    const experiencePoints = totalPoints % 100;
    const nextLevelXP = 100;

    return {
      totalChallenges,
      completed,
      percentage,
      totalPoints,
      totalAttempts: completed,
      averageScore: Number(stats?.average_score || 0),
      goalsCompleted,
      level,
      experiencePoints,
      nextLevelXP,
    };
  },

  // Track event using progress_events table
  trackEvent: async (userId, eventType, eventData) => {
    // Create progress event
    const eventQuery = `
      INSERT INTO progress_events (
        user_id,
        event_type,
        event_data,
        points_earned,
        related_goal_id,
        related_challenge_id,
        timestamp_occurred
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *
    `;
    
    const eventResult = await pool.query(eventQuery, [
      userId,
      eventType,
      JSON.stringify(eventData),
      eventData.points || 0,
      eventData.goalId || null,
      eventData.challengeId || null,
    ]);

    // Update user_statistics
    const updateStatsQuery = `
      INSERT INTO user_statistics (
        user_id,
        total_points,
        total_challenges_completed,
        last_activity_date,
        updated_at
      ) VALUES ($1, $2, 1, CURRENT_DATE, NOW())
      ON CONFLICT (user_id) DO UPDATE SET
        total_points = user_statistics.total_points + $2,
        total_challenges_completed = user_statistics.total_challenges_completed + 1,
        last_activity_date = CURRENT_DATE,
        updated_at = NOW()
      RETURNING *
    `;
    
    await pool.query(updateStatsQuery, [userId, eventData.points || 0]);

    return eventResult.rows[0];
  },

  generateAnalytics: async (userId, timeframe) => {
    // Not implemented in depth
    return { message: 'Analytics not implemented' };
  },

  // Get recent activity from progress_events table
  getActivity: async (userId, timeframe = 'week') => {
    // Calculate date range based on timeframe
    let daysAgo = 7; // default week
    if (timeframe === 'month') daysAgo = 30;
    if (timeframe === 'year') daysAgo = 365;

    const activityQuery = `
      SELECT 
        id,
        event_type,
        event_data,
        points_earned,
        related_goal_id,
        related_challenge_id,
        timestamp_occurred
      FROM progress_events
      WHERE user_id = $1
        AND timestamp_occurred >= NOW() - INTERVAL '${daysAgo} days'
      ORDER BY timestamp_occurred DESC
      LIMIT 20
    `;

    const result = await pool.query(activityQuery, [userId]);
    return result.rows;
  },

  checkMilestones: async (userId) => {
    return { message: 'Milestones not implemented' };
  },

  // Increment goals completed count in user_statistics
  incrementGoalsCompleted: async (userId, count = 1) => {
    const query = `
      INSERT INTO user_statistics (user_id, total_goals_completed, updated_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (user_id) DO UPDATE SET
        total_goals_completed = user_statistics.total_goals_completed + EXCLUDED.total_goals_completed,
        updated_at = NOW()
      RETURNING *
    `;
    const pool = require('../database/connection');
    const result = await pool.query(query, [userId, count]);
    return result.rows[0];
  },
};

module.exports = progressService;
