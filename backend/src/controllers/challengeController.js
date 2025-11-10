const challengeService = require('../services/challengeService');

const challengeController = {
  // Get all challenges with optional filtering
  getChallenges: async (req, res, next) => {
    try {
      const filters = {
        difficulty: req.query.difficulty,
        subject: req.query.subject,
      };
      const challenges = await challengeService.getChallenges(filters);
      res.json(challenges);
    } catch (error) {
      next(error);
    }
  },

  // Get a single challenge by ID
  getChallengeById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const challenge = await challengeService.getChallengeById(id);
      res.json(challenge);
    } catch (error) {
      if (error.message === 'Challenge not found') {
        res.status(404).json({ message: error.message });
      } else {
        next(error);
      }
    }
  },

  // Create a new challenge
  createChallenge: async (req, res, next) => {
    try {
      // TODO: Add isAdmin middleware check
      const challenge = await challengeService.createChallenge(req.body);
      res.status(201).json(challenge);
    } catch (error) {
      if (error.message.includes('Missing required field')) {
        res.status(400).json({ message: error.message });
      } else if (error.message === 'Invalid difficulty level') {
        res.status(400).json({ message: error.message });
      } else {
        next(error);
      }
    }
  },

  // Update an existing challenge
  updateChallenge: async (req, res, next) => {
    try {
      // TODO: Add isAdmin middleware check
      const { id } = req.params;
      const challenge = await challengeService.updateChallenge(id, req.body);
      res.json(challenge);
    } catch (error) {
      if (error.message === 'Challenge not found') {
        res.status(404).json({ message: error.message });
      } else if (error.message === 'Invalid difficulty level') {
        res.status(400).json({ message: error.message });
      } else {
        next(error);
      }
    }
  },

  // Delete a challenge
  deleteChallenge: async (req, res, next) => {
    try {
      // TODO: Add isAdmin middleware check
      const { id } = req.params;
      await challengeService.deleteChallenge(id);
      res.status(204).end();
    } catch (error) {
      if (error.message === 'Challenge not found') {
        res.status(404).json({ message: error.message });
      } else {
        next(error);
      }
    }
  },

  // Get personalized challenges for a user
  getPersonalizedChallenges: async (req, res, next) => {
    try {
      const userId = req.user.id; // From auth middleware
      const challenges = await challengeService.generatePersonalizedChallenges(
        userId
      );
      res.json(challenges);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = challengeController;
