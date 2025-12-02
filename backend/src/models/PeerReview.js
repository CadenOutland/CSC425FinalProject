// backend/src/models/PeerReview.js
const db = require('../database/connection');

class PeerReview {
  static async create(data) {
    const query = `
      INSERT INTO peer_reviews
      (reviewer_id, reviewee_id, submission_id, review_text, rating,
       criteria_scores, time_spent_minutes, is_anonymous, is_completed)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *
    `;
    const params = [
      data.reviewer_id,
      data.reviewee_id,
      data.submission_id,
      data.review_text,
      data.rating,
      data.criteria_scores || null,
      data.time_spent_minutes || null,
      data.is_anonymous ?? true,
      data.is_completed ?? false
    ];

    const result = await db.query(query, params);
    return result.rows[0];
  }

  static async findBySubmission(id) {
    const result = await db.query(
      `SELECT * FROM peer_reviews WHERE submission_id = $1`,
      [id]
    );
    return result.rows;
  }

  static async findByReviewer(id) {
    const result = await db.query(
      `SELECT * FROM peer_reviews WHERE reviewer_id = $1`,
      [id]
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

    const query = `
      UPDATE peer_reviews
      SET ${fields.join(', ')}, updated_at = NOW()
      WHERE id = $${i}
      RETURNING *
    `;

    const result = await db.query(query, values);
    return result.rows[0];
  }
}

module.exports = PeerReview;
