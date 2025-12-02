// backend/src/models/User.js
const db = require('../database/connection');

class User {
  static async findById(id) {
    const query = `
      SELECT 
        id, email, first_name, last_name, profile_image, bio,
        is_active, is_verified, role, created_at, updated_at, last_login
      FROM users
      WHERE id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  }

  static async findByEmail(email) {
    const query = `
      SELECT *
      FROM users
      WHERE LOWER(email) = LOWER($1)
    `;
    const result = await db.query(query, [email]);
    return result.rows[0] || null;
  }

  static async create(data) {
    const query = `
      INSERT INTO users (email, password_hash, first_name, last_name, profile_image, bio, role)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const params = [
      data.email,
      data.password_hash,
      data.first_name,
      data.last_name,
      data.profile_image || null,
      data.bio || null,
      data.role || 'student'
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
      UPDATE users
      SET ${fields.join(', ')}, updated_at = NOW()
      WHERE id = $${i}
      RETURNING *
    `;
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    await db.query(`DELETE FROM users WHERE id = $1`, [id]);
    return true;
  }
}

module.exports = User;
