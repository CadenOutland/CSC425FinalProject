// backend/src/routes/leaderboard.js
const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');
const auth = require('../middleware/auth');

// Full leaderboard
router.get('/', auth, leaderboardController.getLeaderboard);

// User ranking
router.get('/ranking', auth, leaderboardController.getUserRanking);

// Points breakdown
router.get('/points', auth, leaderboardController.getPointsBreakdown);

// Achievements
router.get('/achievements', auth, leaderboardController.getAchievements);

module.exports = router;

