const express = require('express');
const router = express.Router();
const challengeController = require('../controllers/challengeController');
const auth = require('../middleware/auth');

// Get all challenges with optional filtering
router.get('/', auth, challengeController.getChallenges);

// Get personalized challenges for the authenticated user
router.get(
  '/personalized',
  auth,
  challengeController.getPersonalizedChallenges
);

// Get a specific challenge by ID
router.get('/:id', auth, challengeController.getChallengeById);

// Create a new challenge (admin only)
router.post('/', auth, challengeController.createChallenge);

// Update an existing challenge (admin only)
router.put('/:id', auth, challengeController.updateChallenge);

// Delete a challenge (admin only)
router.delete('/:id', auth, challengeController.deleteChallenge);

module.exports = router;
