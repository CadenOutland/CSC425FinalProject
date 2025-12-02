const db = require('../database/connection');

const leaderboardService = {
  // Returns top users by total_points
  calculateRankings: async (timeframe = 'all') => {
    let condition = '';

    if (timeframe === 'weekly') {
      condition = `WHERE p.created_at >= DATE_TRUNC('week', CURRENT_DATE)`;
    } else if (timeframe === 'monthly') {
      condition = `WHERE p.created_at >= DATE_TRUNC('month', CURRENT_DATE)`;
    }

    const query = `
      SELECT 
        u.id AS user_id,
        u.first_name,
        u.last_name,
        COALESCE(SUM(p.points_earned), 0) AS total_points,
        COUNT(CASE WHEN p.completed = true THEN 1 END) AS completed_challenges
      FROM users u
      LEFT JOIN progress p ON u.id = p.user_id
      ${condition}
      GROUP BY u.id
      ORDER BY total_points DESC
      LIMIT 50
    `;

    const { rows } = await db.query(query);
    return rows;
  },

  // Get top N performers
  getTopPerformers: async (limit = 10) => {
    const query = `
      SELECT 
        u.id AS user_id,
        u.first_name,
        u.last_name,
        COALESCE(SUM(p.points_earned), 0) AS total_points
      FROM users u
      LEFT JOIN progress p ON u.id = p.user_id
      GROUP BY u.id
      ORDER BY total_points DESC
      LIMIT $1
    `;
    const { rows } = await db.query(query, [limit]);
    return rows;
  }
};

module.exports = leaderboardService;
