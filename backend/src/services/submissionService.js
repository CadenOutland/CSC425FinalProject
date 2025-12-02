const db = require('../database/connection');
const { AppError } = require('../middleware/errorHandler');

const submissionService = {
  // Create new submission
  submitSolution: async ({ userId, challengeId, submissionText, submissionFiles }) => {
    const query = `
      INSERT INTO submissions (
        user_id, challenge_id, submission_text, submission_files,
        status, attempt_number, submitted_at, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, 'submitted', 1, NOW(), NOW(), NOW())
      RETURNING *
    `;

    const result = await db.query(query, [
      userId,
      challengeId,
      submissionText,
      submissionFiles ? JSON.stringify(submissionFiles) : null
    ]);

    return result.rows[0];
  },

  // Retrieve a submission by ID
  getSubmissionById: async (submissionId) => {
    const { rows } = await db.query(
      'SELECT * FROM submissions WHERE id = $1',
      [submissionId]
    );
    return rows[0] || null;
  },

  // Get all submissions for a user
  getUserSubmissions: async (userId) => {
    const { rows } = await db.query(
      'SELECT * FROM submissions WHERE user_id = $1 ORDER BY submitted_at DESC',
      [userId]
    );
    return rows;
  },

  // Get submissions for a particular challenge
  getChallengeSubmissions: async (challengeId) => {
    const { rows } = await db.query(
      'SELECT * FROM submissions WHERE challenge_id = $1 ORDER BY submitted_at DESC',
      [challengeId]
    );
    return rows;
  },

  // Update submission status (submitted → graded etc.)
  updateSubmissionStatus: async (submissionId, status) => {
    const allowed = ['submitted', 'graded', 'resubmitted', 'reviewing'];

    if (!allowed.includes(status)) {
      throw new AppError('Invalid submission status', 400);
    }

    const query = `
      UPDATE submissions
      SET status = $2, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;

    const { rows } = await db.query(query, [submissionId, status]);

    return rows[0];
  },
};

module.exports = submissionService;
