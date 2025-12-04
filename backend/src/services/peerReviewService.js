// TODO: Implement peer review business logic
const pool = require('../database/connection');

const peerReviewService = {
  // Create a new submission for peer review
  createSubmission: async (submissionData) => {
    const {
      userId,
      challengeId,
      challengeTitle,
      challengeDescription,
      solutionCode,
      difficulty,
      aiFeedback,
      aiScore,
    } = submissionData;

    const query = `
      INSERT INTO peer_reviews (
        submission_id,
        reviewer_id,
        submission_user_id,
        challenge_title,
        challenge_description,
        solution_code,
        difficulty,
        ai_feedback,
        ai_score,
        status,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
      RETURNING *
    `;

    const submissionId = challengeId || `ai-${Date.now()}`;
    const values = [
      submissionId,
      null, // No peer reviewer yet
      userId,
      challengeTitle,
      challengeDescription || '',
      solutionCode,
      difficulty,
      aiFeedback,
      aiScore,
      'pending', // Initial status
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating submission:', error);
      throw error;
    }
  },

  // Get submissions by user
  getSubmissionsByUser: async (userId) => {
    const query = `
      SELECT 
        id,
        submission_id,
        challenge_title as title,
        challenge_description as description,
        solution_code,
        difficulty,
        ai_feedback,
        ai_score,
        review_text,
        rating,
        reviewer_id,
        status,
        created_at
      FROM peer_reviews
      WHERE submission_user_id = $1
      ORDER BY created_at DESC
    `;

    try {
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching user submissions:', error);
      throw error;
    }
  },

  // Get submissions available for review (exclude user's own)
  getAvailableForReview: async (userId, category = null) => {
    let query = `
      SELECT 
        id,
        submission_id,
        submission_user_id,
        challenge_title as title,
        challenge_description as description,
        solution_code,
        difficulty,
        status,
        created_at
      FROM peer_reviews
      WHERE submission_user_id != $1
        AND status = 'pending'
    `;

    const params = [userId];

    if (category && category !== 'all') {
      query += ' AND LOWER(difficulty) = LOWER($2)';
      params.push(category);
    }

    query += ' ORDER BY created_at DESC LIMIT 20';

    try {
      const result = await pool.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Error fetching review queue:', error);
      throw error;
    }
  },

  // Add a peer review to a submission
  addReview: async ({ submissionId, reviewerId, reviewText, rating }) => {
    const updateByIdQuery = `
      UPDATE peer_reviews
      SET 
        reviewer_id = $1,
        review_text = $2,
        rating = $3,
        status = 'reviewed',
        updated_at = NOW()
      WHERE id = $4
      RETURNING *
    `;

    const updateBySubmissionIdQuery = `
      UPDATE peer_reviews
      SET 
        reviewer_id = $1,
        review_text = $2,
        rating = $3,
        status = 'reviewed',
        updated_at = NOW()
      WHERE submission_id = $4
      RETURNING *
    `;

    try {
      // First, try updating by primary key id
      const byIdResult = await pool.query(updateByIdQuery, [
        reviewerId,
        reviewText,
        rating,
        submissionId,
      ]);

      if (byIdResult.rows.length > 0) {
        return byIdResult.rows[0];
      }

      // If not found, try updating by external submission_id
      const bySubmissionIdResult = await pool.query(updateBySubmissionIdQuery, [
        reviewerId,
        reviewText,
        rating,
        submissionId,
      ]);

      if (bySubmissionIdResult.rows.length > 0) {
        return bySubmissionIdResult.rows[0];
      }

      throw new Error('Submission not found');
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  },

  // TODO: Create new peer review
  createReview: async (reviewData) => {
    // Implementation needed
    throw new Error('Not implemented');
  },

  // TODO: Get reviews for submission
  getReviewsForSubmission: async (submissionId) => {
    // Implementation needed
    throw new Error('Not implemented');
  },

  // TODO: Get reviews by reviewer
  getReviewsByReviewer: async (reviewerId) => {
    // Implementation needed
    throw new Error('Not implemented');
  },

  // TODO: Update review
  updateReview: async (reviewId, updateData) => {
    // Implementation needed
    throw new Error('Not implemented');
  },

  // TODO: Delete review
  deleteReview: async (reviewId) => {
    // Implementation needed
    throw new Error('Not implemented');
  },

  // TODO: Get pending reviews for user
  getPendingReviews: async (userId) => {
    // Implementation needed
    throw new Error('Not implemented');
  },

  // TODO: Submit review rating
  submitRating: async (reviewId, rating) => {
    // Implementation needed
    throw new Error('Not implemented');
  },
};

module.exports = peerReviewService;
