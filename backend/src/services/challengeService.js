const Challenge = require('../models/Challenge');

const challengeService = {
  // Get all challenges, optionally filtered
  getChallenges: async (filters = {}) => {
    try {
      if (filters.difficulty) {
        return await Challenge.findByDifficulty(filters.difficulty);
      } else if (filters.subject) {
        return await Challenge.findBySubject(filters.subject);
      }
      return await Challenge.findAll();
    } catch (error) {
      throw new Error(`Error getting challenges: ${error.message}`);
    }
  },

  // Get a single challenge by ID
  getChallengeById: async (challengeId) => {
    try {
      const challenge = await Challenge.findById(challengeId);
      if (!challenge) {
        throw new Error('Challenge not found');
      }
      return challenge;
    } catch (error) {
      throw new Error(`Error getting challenge: ${error.message}`);
    }
  },

  // Create a new challenge
  createChallenge: async (challengeData) => {
    try {
      // Validate required fields
      const requiredFields = ['title', 'description', 'difficulty', 'points'];
      requiredFields.forEach((field) => {
        if (!challengeData[field]) {
          throw new Error(`Missing required field: ${field}`);
        }
      });

      // Validate difficulty
      const validDifficulties = ['easy', 'medium', 'hard'];
      if (!validDifficulties.includes(challengeData.difficulty.toLowerCase())) {
        throw new Error('Invalid difficulty level');
      }

      return await Challenge.create(challengeData);
    } catch (error) {
      throw new Error(`Error creating challenge: ${error.message}`);
    }
  },

  // Update an existing challenge
  updateChallenge: async (challengeId, updateData) => {
    try {
      const challenge = await Challenge.findById(challengeId);
      if (!challenge) {
        throw new Error('Challenge not found');
      }

      // Validate difficulty if it's being updated
      if (updateData.difficulty) {
        const validDifficulties = ['easy', 'medium', 'hard'];
        if (!validDifficulties.includes(updateData.difficulty.toLowerCase())) {
          throw new Error('Invalid difficulty level');
        }
      }

      return await Challenge.update(challengeId, updateData);
    } catch (error) {
      throw new Error(`Error updating challenge: ${error.message}`);
    }
  },

  // Delete a challenge
  deleteChallenge: async (challengeId) => {
    try {
      const challenge = await Challenge.findById(challengeId);
      if (!challenge) {
        throw new Error('Challenge not found');
      }
      return await Challenge.delete(challengeId);
    } catch (error) {
      throw new Error(`Error deleting challenge: ${error.message}`);
    }
  },

  // Generate personalized challenges based on user's progress and preferences
  generatePersonalizedChallenges: async (userId) => {
    try {
      // TODO: Implement personalization logic
      const challenges = await Challenge.findAll();
      return challenges.slice(0, 5); // Return top 5 challenges for now
    } catch (error) {
      throw new Error(
        `Error generating personalized challenges: ${error.message}`
      );
    }
  },

  // Validate challenge completion
  validateCompletion: async (challengeId, submissionData) => {
    try {
      const challenge = await Challenge.findById(challengeId);
      if (!challenge) {
        throw new Error('Challenge not found');
      }

      // TODO: Implement validation logic based on challenge type
      return true;
    } catch (error) {
      throw new Error(
        `Error validating challenge completion: ${error.message}`
      );
    }
  },

  // Calculate challenge difficulty based on various factors
  calculateDifficulty: (challenge) => {
    // TODO: Implement sophisticated difficulty calculation
    const points = challenge.points || 0;
    if (points < 50) return 'easy';
    if (points < 100) return 'medium';
    return 'hard';
  },
};

module.exports = challengeService;
