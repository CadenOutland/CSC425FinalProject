const Challenge = require('../models/Challenge');
const { AppError } = require('../middleware/errorHandler');

const challengeService = {

  // Get all challenges with optional filters
  getChallenges: async (filters = {}) => {
    const rows = await Challenge.findAll();

    const filtered = rows.filter(ch => {
      if (filters.difficulty) {
        const diff = (ch.difficulty || ch.difficulty_level)?.toLowerCase();
        if (diff !== filters.difficulty.toLowerCase()) return false;
      }

      if (filters.category) {
        const cat = (ch.category || ch.subject)?.toLowerCase();
        if (cat !== filters.category.toLowerCase()) return false;
      }

      if (filters.search) {
        const s = filters.search.toLowerCase();
        const inTitle = String(ch.title || '').toLowerCase().includes(s);
        const inDesc = String(ch.description || '').toLowerCase().includes(s);
        if (!inTitle && !inDesc) return false;
      }

      return true;
    });

    return filtered.map(r => ({
      id: r.id,
      title: r.title,
      description: r.description,
      instructions: r.instructions || r.content || '',
      category: r.category || r.subject,
      difficulty: r.difficulty || r.difficulty_level,
      estimated_time_minutes: r.estimated_time_minutes,
      points_reward: r.points_reward || r.points || 10,
      created_at: r.created_at,
      updated_at: r.updated_at
    }));
  },

  getById: async (challengeId) => {
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) throw new AppError('Challenge not found', 404);
    return challenge;
  },

  createChallenge: async (data) => {
    const dbObj = {
      title: data.title,
      description: data.description,
      difficulty: data.difficulty || data.difficulty_level || 'medium',
      subject: data.category || data.subject || null,
      points: data.points || data.points_reward || 10,
      type: data.type || null,
      content: data.instructions || data.content || null
    };

    const created = await Challenge.create(dbObj);
    return created;
  },

  updateChallenge: async (id, updateData) => {
    return await Challenge.update(id, updateData);
  },

  deleteChallenge: async (id) => {
    return await Challenge.delete(id);
  }
};

module.exports = challengeService;

