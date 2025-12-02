// backend/src/models/UserLink.js
const db = require('../database/connection');

class UserLink {
  static async create(data) {
    const query = `
      INSERT INTO user_links
      (mongo_id, sql_user_id)
      VALUES ($1,$2)
      RETURNING *
    `;
    const result = await db.query(query, [data.mongo_id, data.sql_user_id]);
    return result.rows[0];
  }

  static async findByMongoId(mongoId) {
    const result = await db.query(
      `SELECT * FROM user_links WHERE mongo_id = $1`,
      [mongoId]
    );
    return result.rows[0] || null;
  }

  static async findBySqlId(sqlId) {
    const result = await db.query(
      `SELECT * FROM user_links WHERE sql_user_id = $1`,
      [sqlId]
    );
    return result.rows[0] || null;
  }
}

module.exports = UserLink;
