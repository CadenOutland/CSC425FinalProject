const peerReviewService = require('../services/peerReviewService');
const { AppError } = require('../middleware/errorHandler');

const peerReviewController = {
  // GET /reviews/assignments
  getReviewAssignments: async (req, res, next) => {
    try {
      const list = await peerReviewService.getPendingReviews(req.user.id);
      res.json({ assignments: list });
    } catch (err) {
      next(err);
    }
  },

  // POST /reviews
  submitReview: async (req, res, next) => {
    try {
      const { submissionId, reviewText, rating } = req.body;

      if (!submissionId || !reviewText || !rating)
        throw new AppError('submissionId, reviewText, and rating are required', 400);

      const created = await peerReviewService.createReview({
        reviewerId: req.user.id,
        submissionId,
        reviewText,
        rating,
      });

      res.status(201).json({
        message: 'Review submitted successfully',
        review: created,
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /reviews/received
  getReceivedReviews: async (req, res, next) => {
    try {
      const list = await peerReviewService.getReviewsForSubmission(req.user.id);

      res.json({ reviews: list });
    } catch (err) {
      next(err);
    }
  },

  // GET /reviews/history
  getReviewHistory: async (req, res, next) => {
    try {
      const list = await peerReviewService.getReviewsByReviewer(req.user.id);

      res.json({ history: list });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = peerReviewController;

