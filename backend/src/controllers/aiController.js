const aiService = require('../services/aiService');
const Challenge = require('../models/Challenge');
const Progress = require('../models/Progress');
const { AppError } = require('../middleware/errorHandler');

const aiController = {
  // POST /ai/feedback
  generateFeedback: async (req, res, next) => {
    try {
      const { submissionText, challengeId } = req.body;
      if (!submissionText) throw new AppError('submissionText is required', 400);

      let context = '';
      if (challengeId) {
        const challenge = await Challenge.findById(challengeId);
        if (challenge) context = challenge.description || '';
      }

      const feedback = await aiService.generateFeedback(submissionText, context);

      res.json({ feedback });
    } catch (err) {
      next(err);
    }
  },

  // GET /ai/hints/:challengeId
  getHints: async (req, res, next) => {
    try {
      const challenge = await Challenge.findById(req.params.challengeId);
      if (!challenge) throw new AppError('Challenge not found', 404);

      const summary = await Progress.getUserSummary?.(req.user.id);

      const hints = await aiService.generateHints(challenge, summary);

      res.json({ hints });
    } catch (err) {
      next(err);
    }
  },

  // GET /ai/suggestions
  suggestChallenges: async (req, res, next) => {
    try {
      const profile = { id: req.user.id, email: req.user.email };
      const completed = await Challenge.getCompletedForUser?.(req.user.id);

      const suggestions = await aiService.suggestNextChallenges(profile, completed || []);

      res.json({ suggestions });
    } catch (err) {
      next(err);
    }
  },

  // GET /ai/analysis
  analyzeProgress: async (req, res, next) => {
    try {
      const data = await Progress.getLearningData?.(req.user.id);
      const analysis = await aiService.analyzePattern(data || {});

      res.json({ analysis });
    } catch (err) {
      next(err);
    }
  },

  // POST /ai/generateChallenge
  generateChallenge: async (req, res, next) => {
    try {
      const prompt = req.body.prompt || 'Give an interesting coding challenge.';
      const result = await aiService.generateFeedback(prompt, '');

      res.json({ challenge: result });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = aiController;
