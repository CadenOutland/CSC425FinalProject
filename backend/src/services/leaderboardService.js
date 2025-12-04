// Leaderboard calculations and rankings based on user_statistics
const pool = require('../database/connection');

const leaderboardService = {
  // Get global leaderboard from user_statistics (fallback to 0s)
  getGlobal: async (limit = 10) => {
    const query = `
      SELECT 
        u.id::integer AS id,
        u.email,
        u.first_name,
        u.last_name,
        COALESCE(us.total_points, 0)::integer AS total_points,
        COALESCE(us.total_challenges_completed, 0)::integer AS challenges_completed,
        COALESCE(us.average_score, 0)::numeric AS average_score
      FROM users u
      LEFT JOIN user_statistics us ON us.user_id = u.id::text
      WHERE u.is_active = true
      ORDER BY total_points DESC, challenges_completed DESC, average_score DESC
      LIMIT $1
    `;
    const result = await pool.query(query, [limit]);
    return result.rows;
  },

  // Get user's rank by total_points
  getUserRank: async (userId) => {
    const query = `
      WITH ranked AS (
        SELECT 
          u.id,
          COALESCE(us.total_points, 0) AS total_points,
          RANK() OVER (ORDER BY COALESCE(us.total_points, 0) DESC) AS rank
        FROM users u
        LEFT JOIN user_statistics us ON us.user_id = u.id::text
        WHERE u.is_active = true
      )
      SELECT rank, total_points FROM ranked WHERE id = $1
    `;
    const result = await pool.query(query, [userId]);
    return result.rows[0] || { rank: null, total_points: 0 };
  },

  // Get top performers alias
  getTopPerformers: async (limit = 10) => {
    return leaderboardService.getGlobal(limit);
  },

  // Calculate achievement points (placeholder)
  calculateAchievementPoints: (achievement) => {
    return 0;
  },
};

module.exports = leaderboardService;
