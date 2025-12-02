// backend/src/models/Goal.js
const db = require('../database/connection');

class Goal {
  static async findByUserId(userId) {
    const result = await db.query(
      `SELECT * FROM goals WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    return result.rows;
  }

  static async findById(id) {
    const result = await db.query(`SELECT * FROM goals WHERE id = $1`, [id]);
    return result.rows[0] || null;
  }

  static async create(data) {
    const query = `
      INSERT INTO goals 
      (user_id, title, description, category, difficulty_level,
       target_completion_date, is_completed, progress_percentage, points_reward)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *
    `;
    const params = [
      data.user_id,
      data.title,
      data.description || null,
      data.category || null,
      data.difficulty_level || 'medium',
      data.target_completion_date || null,
      false,
      data.progress_percentage || 0,
      data.points_reward || 0
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

    const result = await db.query(
      `UPDATE goals SET ${fields.join(', ')}, updated_at = NOW()
       WHERE id = $${i} RETURNING *`,
      values
    );

    return result.rows[0];
  }

  static async delete(id) {
    const result = await db.query(
      `DELETE FROM goals WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }
}

module.exports = Goal;

