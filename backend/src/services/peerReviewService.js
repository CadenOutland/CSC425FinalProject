const db = require('../database/connection');
const { AppError } = require('../middleware/errorHandler');

const peerReviewService = {

  // Create a new review
  createReview: async ({ reviewerId, submissionId, reviewText, rating }) => {
    const query = `
      INSERT INTO peer_reviews (
        reviewer_id, submission_id, review_text, rating,
        is_completed, completed_at, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, true, NOW(), NOW(), NOW())
      RETURNING *
    `;

    const { rows } = await db.query(query, [
      reviewerId,
      submissionId,
      reviewText,
      rating
    ]);

    return rows[0];
  },

  // Get reviews for a submission
  getReviewsForSubmission: async (submissionId) => {
    const { rows } = await db.query(
      'SELECT * FROM peer_reviews WHERE submission_id = $1 ORDER BY created_at DESC',
      [submissionId]
    );
    return rows;
  },

  // Get reviews authored by reviewer
  getReviewsByReviewer: async (reviewerId) => {
    const { rows } = await db.query(
      'SELECT * FROM peer_reviews WHERE reviewer_id = $1 ORDER BY created_at DESC',
      [reviewerId]
    );
    return rows;
  },

  // Pending review assignments (simple version: submissions not by the user)
  getPendingReviews: async (userId) => {
    const query = `
      SELECT s.*
      FROM submissions s
      WHERE s.user_id != $1
      AND NOT EXISTS (
        SELECT 1 FROM peer_reviews pr
        WHERE pr.submission_id = s.id AND pr.reviewer_id = $1
      )
      ORDER BY s.submitted_at DESC
      LIMIT 5
    `;

    const { rows } = await db.query(query, [userId]);
    return rows;
  },

  // Update a review
  updateReview: async (reviewId, updateData) => {
    const query = `
      UPDATE peer_reviews
      SET review_text = COALESCE($2, review_text),
          rating = COALESCE($3, rating),
          updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;

    const { rows } = await db.query(query, [
      reviewId,
      updateData.reviewText || null,
      updateData.rating || null
    ]);

    return rows[0];
  },

  // Delete review
  deleteReview: async (reviewId) => {
    await db.query('DELETE FROM peer_reviews WHERE id = $1', [reviewId]);
    return { success: true };
  }
};

module.exports = peerReviewService;
