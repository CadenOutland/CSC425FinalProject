// TODO: Implement peer review routes
const express = require('express');
const router = express.Router();
const peerReviewController = require('../controllers/peerReviewController');
const auth = require('../middleware/auth');

// Submit a solution for peer review (from AI challenge generator)
router.post('/submit', auth, peerReviewController.submitForReview);

// Get user's own submissions
router.get('/my-submissions', auth, peerReviewController.getMySubmissions);

// Get submissions available for review
router.get('/queue', auth, peerReviewController.getReviewQueue);

// Submit a peer review for a submission
router.post('/submissions/:submissionId/review', auth, peerReviewController.submitReview);

// TODO: Add GET /assignments route for review assignments
router.get('/assignments', auth, peerReviewController.getReviewAssignments);

// TODO: Add POST / route for submitting review
router.post('/', auth, peerReviewController.submitReview);

// TODO: Add GET /received route for received reviews
router.get('/received', auth, peerReviewController.getReceivedReviews);

// TODO: Add GET /history route for review history
router.get('/history', auth, peerReviewController.getReviewHistory);

module.exports = router;
