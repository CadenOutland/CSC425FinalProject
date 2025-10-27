// TODO: Implement challenges CRUD operations controller
const challengeController = {
  // Get all challenges
  getChallenges: async (req, res, next) => {
    try {
      const Challenge = require('../models/Challenge');
      const challenges = await Challenge.findAll();

      res.json({
        success: true,
        data: { challenges },
        message: 'Challenges fetched',
      });
    } catch (error) {
      next(error);
    }
  },

  // Get challenge by ID
  getChallengeById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const Challenge = require('../models/Challenge');
      const challenge = await Challenge.findById(id);

      if (!challenge)
        return res
          .status(404)
          .json({ success: false, error: { message: 'Challenge not found' } });

      res.json({
        success: true,
        data: { challenge },
        message: 'Challenge fetched',
      });
    } catch (error) {
      next(error);
    }
  },

  // Create new challenge (admin)
  createChallenge: async (req, res, next) => {
    try {
      const challengeData = req.body;
      const Challenge = require('../models/Challenge');
      const created = await Challenge.create(challengeData);
      res
        .status(201)
        .json({
          success: true,
          data: { challenge: created },
          message: 'Challenge created',
        });
    } catch (error) {
      next(error);
    }
  },

  // Update challenge
  updateChallenge: async (req, res, next) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const Challenge = require('../models/Challenge');
      const updated = await Challenge.update(id, updateData);
      res.json({
        success: true,
        data: { challenge: updated },
        message: 'Challenge updated',
      });
    } catch (error) {
      next(error);
    }
  },

  // Delete challenge
  deleteChallenge: async (req, res, next) => {
    try {
      const { id } = req.params;
      const Challenge = require('../models/Challenge');
      const deleted = await Challenge.delete(id);
      res.json({
        success: true,
        data: { challenge: deleted },
        message: 'Challenge deleted',
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = challengeController;
