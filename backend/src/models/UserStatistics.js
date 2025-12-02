// backend/src/models/UserStatistics.js
const db = require('../database/connection');

class UserStatistics {
  static async create(userId) {
    const query = `
      INSERT INTO user_statistics (user_id, created_at)
      VALUES ($1, NOW())
      ON CONFLICT (user_id) DO NOTHING
      RETURNING *
    `;
    const result = await db.query(query, [userId]);
    return result.rows[0] || null;
  }

  static async findByUserId(userId) {
    const result = await db.query(
      `SELECT * FROM user_statistics WHERE user_id = $1`,
      [userId]
    );
    return result.rows[0] || null;
  }

  static async update(userId, data) {
    const fields = [];
    const values = [];
    let i = 1;

    for (const key in data) {
      fields.push(`${key} = $${i}`);
      values.push(data[key]);
      i++;
    }

    values.push(userId);

    const query = `
      UPDATE user_statistics
      SET ${fields.join(', ')}, updated_at = NOW()
      WHERE user_id = $${i}
      RETURNING *
    `;

    const result = await db.query(query, values);
    return result.rows[0];
  }
}

module.exports = UserStatistics;
