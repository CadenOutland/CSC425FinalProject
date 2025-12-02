// backend/src/routes/reviews.js
const express = require('express');
const router = express.Router();
const peerReviewController = require('../controllers/peerReviewController');
const auth = require('../middleware/auth');

// Assigned reviews
router.get('/assignments', auth, peerReviewController.getReviewAssignments);

// Submit review
router.post('/', auth, peerReviewController.submitReview);

// Reviews received
router.get('/received', auth, peerReviewController.getReceivedReviews);

// Review history
router.get('/history', auth, peerReviewController.getReviewHistory);

module.exports = router;

