const challengeService = require('../services/challengeService');
const { AppError } = require('../middleware/errorHandler');

const challengeController = {
  // GET /challenges
  getChallenges: async (req, res, next) => {
    try {
      const filters = {
        difficulty: req.query.difficulty,
        category: req.query.category,
        search: req.query.search,
      };

      const challenges = await challengeService.getChallenges(filters);

      res.json({
        message: 'Challenges fetched successfully',
        challenges,
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /challenges/:id
  getChallengeById: async (req, res, next) => {
    try {
      const challenge = await challengeService.getById(req.params.id);
      if (!challenge) throw new AppError('Challenge not found', 404);

      res.json({ challenge });
    } catch (err) {
      next(err);
    }
  },

  // POST /challenges (admin only ideally)
  createChallenge: async (req, res, next) => {
    try {
      const challenge = await challengeService.createChallenge(req.body);

      res.status(201).json({
        message: 'Challenge created successfully',
        challenge,
      });
    } catch (err) {
      next(err);
    }
  },

  // PUT /challenges/:id
  updateChallenge: async (req, res, next) => {
    try {
      const updated = await challengeService.updateChallenge(req.params.id, req.body);

      res.json({
        message: 'Challenge updated successfully',
        challenge: updated,
      });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /challenges/:id
  deleteChallenge: async (req, res, next) => {
    try {
      await challengeService.deleteChallenge(req.params.id);

      res.json({ message: 'Challenge deleted successfully' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = challengeController;
