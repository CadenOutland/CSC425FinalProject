// backend/src/models/Leaderboard.js
const db = require('../database/connection');

class Leaderboard {
  static async find(timeframe = 'all-time', limit = 10) {
    const result = await db.query(
      `SELECT * 
       FROM leaderboard
       WHERE timeframe = $1
       ORDER BY rank_position ASC
       LIMIT $2`,
      [timeframe, limit]
    );
    return result.rows;
  }

  static async findByUser(userId, timeframe = 'all-time') {
    const result = await db.query(
      `SELECT *
       FROM leaderboard
       WHERE user_id = $1 AND timeframe = $2`,
      [userId, timeframe]
    );
    return result.rows[0] || null;
  }

  static async createOrUpdate(data) {
    const query = `
      INSERT INTO leaderboard 
      (user_id, timeframe, rank_position, points, challenges_completed, goals_completed,
       period_start, period_end)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      ON CONFLICT (user_id, timeframe, period_start)
      DO UPDATE SET 
        rank_position = EXCLUDED.rank_position,
        points = EXCLUDED.points,
        challenges_completed = EXCLUDED.challenges_completed,
        goals_completed = EXCLUDED.goals_completed,
        updated_at = NOW()
      RETURNING *
    `;

    const result = await db.query(query, [
      data.user_id,
      data.timeframe,
      data.rank_position,
      data.points,
      data.challenges_completed,
      data.goals_completed,
      data.period_start,
      data.period_end
    ]);

    return result.rows[0];
  }
}

module.exports = Leaderboard;

