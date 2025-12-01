const challengeService = require('../services/challengeService');

const challengeController = {
  getChallenges: async (req, res, next) => {
    try {
      const filters = {
        difficulty: req.query.difficulty,
        category: req.query.category,
        search: req.query.search,
      };
      const challenges = await challengeService.getChallenges(filters);
      return res.json({ data: challenges });
    } catch (error) {
      next(error);
    }
  },

  getChallengeById: async (req, res, next) => {
    try {
      const id = req.params.id;
      const challenge = await challengeService.getById(id);
      if (!challenge)
        return res.status(404).json({ message: 'Challenge not found' });
      return res.json({ data: challenge });
    } catch (error) {
      next(error);
    }
  },

  createChallenge: async (req, res, next) => {
    try {
      // Optionally require auth for creation (check middleware in routes)
      const payload = req.body;
      if (!payload.title || !payload.description) {
        return res
          .status(400)
          .json({ message: 'title and description are required' });
      }
      const created = await challengeService.createChallenge(payload);
      return res.status(201).json({ data: created });
    } catch (error) {
      next(error);
    }
  },

  updateChallenge: async (req, res, next) => {
    try {
      const id = req.params.id;
      const payload = req.body;
      const updated = await challengeService.updateChallenge(id, payload);
      return res.json({ data: updated });
    } catch (error) {
      next(error);
    }
  },

  completeChallenge: async (req, res, next) => {
    try {
      const id = req.params.id;
      const userId = req.user.id;
      const completed = await challengeService.completeChallenge(id, userId);
      return res.json({ data: completed });
    } catch (error) {
      next(error);
    }
  },

  deleteChallenge: async (req, res, next) => {
    try {
      const id = req.params.id;
      await challengeService.deleteChallenge(id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};

module.exports = challengeController;
