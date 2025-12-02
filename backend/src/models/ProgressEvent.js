// backend/src/models/ProgressEvent.js
const db = require('../database/connection');

class ProgressEvent {
  static async create(data) {
    const query = `
      INSERT INTO progress_events
      (user_id, event_type, event_data, points_earned,
       related_goal_id, related_challenge_id, related_submission_id,
       session_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *
    `;
    const params = [
      data.user_id,
      data.event_type,
      data.event_data || {},
      data.points_earned || 0,
      data.related_goal_id || null,
      data.related_challenge_id || null,
      data.related_submission_id || null,
      data.session_id || null
    ];

    const result = await db.query(query, params);
    return result.rows[0];
  }

  static async findByUser(userId) {
    const result = await db.query(
      `SELECT * FROM progress_events WHERE user_id = $1 ORDER BY timestamp_occurred DESC`,
      [userId]
    );
    return result.rows;
  }
}

module.exports = ProgressEvent;
