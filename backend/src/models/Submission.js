// backend/src/models/Submission.js
const db = require('../database/connection');

class Submission {
  static async create(data) {
    const query = `
      INSERT INTO submissions 
      (user_id, challenge_id, submission_text, submission_files, status,
       score, attempt_number, time_spent_minutes)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *
    `;
    const params = [
      data.user_id,
      data.challenge_id,
      data.submission_text,
      data.submission_files || null,
      data.status || 'submitted',
      data.score || null,
      data.attempt_number || 1,
      data.time_spent_minutes || null
    ];
    const result = await db.query(query, params);
    return result.rows[0];
  }

  static async findById(id) {
    const result = await db.query(
      `SELECT * FROM submissions WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  static async findByUser(userId) {
    const result = await db.query(
      `SELECT * FROM submissions WHERE user_id = $1 ORDER BY submitted_at DESC`,
      [userId]
    );
    return result.rows;
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
      `UPDATE submissions SET ${fields.join(', ')}, updated_at = NOW()
       WHERE id = $${i}
       RETURNING *`,
      values
    );

    return result.rows[0];
  }
}

module.exports = Submission;
