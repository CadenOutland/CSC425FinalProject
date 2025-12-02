// backend/src/routes/challenges.js
const express = require('express');
const router = express.Router();
const challengeController = require('../controllers/challengeController');
const auth = require('../middleware/auth');

// All challenges
router.get('/', auth, challengeController.getChallenges);

// Single challenge
router.get('/:id', auth, challengeController.getChallengeById);

// Create (admin)
router.post('/', auth, challengeController.createChallenge);

// Update (admin)
router.put('/:id', auth, challengeController.updateChallenge);

// Delete (admin)
router.delete('/:id', auth, challengeController.deleteChallenge);

module.exports = router;
