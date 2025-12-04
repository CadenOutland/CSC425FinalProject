// TODO: Implement AI integration controller for feedback and hints
const aiService = require('../services/aiService');
const challengeService = require('../services/challengeService');

const aiController = {
  // Generate AI challenge based on user's learning level
  generateChallenge: async (req, res, next) => {
    try {
      const { category, difficulty, goalId, goalTitle, goalCategory } = req.body;
      const userId = req.user.id;

      const challenge = await aiService.generateChallenge(userId, {
        category,
        difficulty,
        goalId,
        goalTitle,
        goalCategory,
      });
      
      // Return the challenge without saving to database
      // User must explicitly save it by clicking "Accept Challenge"
      res.json({ success: true, data: challenge });
    } catch (error) {
      next(error);
    }
  },

  // Save a generated challenge to the challenges table
  saveChallenge: async (req, res, next) => {
    try {
      const { 
        title, 
        description, 
        instructions, 
        category, 
        difficulty, 
        points, 
        estimatedTime 
      } = req.body;
      
      const userId = req.user?.id || null;

      const saved = await challengeService.createChallenge({
        title,
        description,
        instructions,
        category: category || 'General',
        difficulty: difficulty || 'medium',
        points: points || 10,
        estimatedTime: estimatedTime || null,
        userId: userId, // Add userId to track who created it
      });

      res.json({ success: true, data: saved });
    } catch (error) {
      next(error);
    }
  },

  // TODO: Generate AI feedback for submission
  generateFeedback: async (req, res, next) => {
    // Implementation needed
  },

  // TODO: Get AI hints for challenge
  getHints: async (req, res, next) => {
    // Implementation needed
  },

  // TODO: Generate challenge suggestions
  suggestChallenges: async (req, res, next) => {
    // Implementation needed
  },

  // TODO: Analyze learning progress
  analyzeProgress: async (req, res, next) => {
    // Implementation needed
  },
};

module.exports = aiController;
