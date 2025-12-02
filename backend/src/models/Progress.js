// backend/src/models/Progress.js
const db = require('../database/connection');

class Progress {
  static async findByUserId(userId) {
    const result = await db.query(
      `SELECT * FROM progress WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    return result.rows;
  }

  static async getUserStats(userId) {
    const result = await db.query(
      `SELECT 
         COUNT(*) AS total_attempts,
         COUNT(CASE WHEN completed = true THEN 1 END) AS completed_challenges,
         SUM(points_earned) AS total_points,
         AVG(CASE WHEN completed = true THEN score END) AS average_score
       FROM progress
       WHERE user_id = $1`,
      [userId]
    );
    return result.rows[0];
  }

  static async findByUserAndChallenge(userId, challengeId) {
    const result = await db.query(
      `SELECT * FROM progress WHERE user_id = $1 AND challenge_id = $2`,
      [userId, challengeId]
    );
    return result.rows[0] || null;
  }

  static async create(data) {
    const query = `
      INSERT INTO progress 
      (user_id, challenge_id, score, completed, points_earned, time_spent)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *
    `;
    const params = [
      data.user_id,
      data.challenge_id,
      data.score || null,
      data.completed || false,
      data.points_earned || 0,
      data.time_spent || 0
    ];

    const result = await db.query(query, params);
    return result.rows[0];
  }

  static async update(id, data) {
    const fields = [];
    const values = [];
    let i = 1;

    for (const key in data) {
      fields.push(`${key} = $${i}`);
      values.push(data[key]);
      i++;
    }

    values.push(id);

    const query = `
      UPDATE progress
      SET ${fields.join(', ')}, updated_at = NOW()
      WHERE id = $${i}
      RETURNING *
    `;

    const result = await db.query(query, values);
    return result.rows[0];
  }
}

module.exports = Progress;

