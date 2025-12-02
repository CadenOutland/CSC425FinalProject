// backend/src/routes/ai.js
const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const auth = require('../middleware/auth');

// AI Feedback
router.post('/feedback', auth, aiController.generateFeedback);

// Hints for a challenge
router.get('/hints/:challengeId', auth, aiController.getHints);

// Suggest challenges
router.get('/suggestions', auth, aiController.suggestChallenges);

// Analyze user progress
router.get('/analysis', auth, aiController.analyzeProgress);

// Generate new challenge
router.post('/generateChallenge', auth, aiController.generateChallenge);

module.exports = router;

