// backend/src/models/Achievement.js
const db = require('../database/connection');

class Achievement {
  static async findAll() {
    const result = await db.query(`SELECT * FROM achievements`);
    return result.rows;
  }

  static async findById(id) {
    const result = await db.query(
      `SELECT * FROM achievements WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  static async create(data) {
    const query = `
      INSERT INTO achievements
      (name, description, category, badge_icon, points_reward,
       criteria, is_active, rarity)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *
    `;

    const result = await db.query(query, [
      data.name,
      data.description,
      data.category,
      data.badge_icon || null,
      data.points_reward || 0,
      data.criteria,
      data.is_active ?? true,
      data.rarity || 'common'
    ]);

    return result.rows[0];
  }
}

module.exports = Achievement;
