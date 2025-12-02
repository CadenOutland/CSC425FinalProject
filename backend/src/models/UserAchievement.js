// backend/src/models/UserAchievement.js
const db = require('../database/connection');

class UserAchievement {
  static async create(data) {
    const query = `
      INSERT INTO user_achievements
      (user_id, achievement_id, progress_data, is_displayed)
      VALUES ($1,$2,$3,$4)
      ON CONFLICT (user_id, achievement_id) DO NOTHING
      RETURNING *
    `;
    const params = [
      data.user_id,
      data.achievement_id,
      data.progress_data || null,
      data.is_displayed ?? true
    ];

    const result = await db.query(query, params);
    return result.rows[0] || null;
  }

  static async findByUser(userId) {
    const result = await db.query(
      `SELECT * FROM user_achievements WHERE user_id = $1`,
      [userId]
    );
    return result.rows;
  }
}

module.exports = UserAchievement;
