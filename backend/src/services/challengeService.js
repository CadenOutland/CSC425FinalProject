const Challenge = require('../models/Challenge');

const challengeService = {
  // Get challenges; support simple filters object { difficulty, category, search }
  getChallenges: async (filters = {}) => {
    // For now, ignore complex filtering and return all challenges then filter in JS
    const rows = await Challenge.findAll();

    const filtered = rows.filter((r) => {
      if (filters.difficulty && (r.difficulty || r.difficulty_level || '').toLowerCase() !== filters.difficulty.toLowerCase()) return false;
      if (filters.category && (r.category || r.subject || '').toLowerCase() !== filters.category.toLowerCase()) return false;
      if (filters.search) {
        const s = filters.search.toLowerCase();
        const inTitle = String(r.title || '').toLowerCase().includes(s);
        const inDesc = String(r.description || '').toLowerCase().includes(s);
        const inTags = (r.tags || []).some(t => String(t).toLowerCase().includes(s));
        if (!inTitle && !inDesc && !inTags) return false;
      }
      return true;
    });

    return filtered.map(r => ({
      id: r.id,
      title: r.title,
      description: r.description,
      category: r.category || r.subject || null,
      difficulty: r.difficulty || r.difficulty_level || 'medium',
      points: r.points || r.points_reward || 10,
      estimatedTime: r.estimated_time_minutes || r.estimatedTime || null,
      tags: r.tags || [],
      created_at: r.created_at,
    }));
  },

  getById: async (id) => {
    return await Challenge.findById(id);
  },

  createChallenge: async (data) => {
    const dbObj = {
      title: data.title,
      description: data.description,
      difficulty: data.difficulty || data.difficulty_level || 'medium',
      subject: data.category || data.subject || null,
      points: data.points || data.points_reward || 10,
      type: data.type || null,
      content: data.instructions || data.content || null,
    };

    const created = await Challenge.create(dbObj);
  },

  completeChallenge: async (challengeId, userId) => {
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      throw new Error('Challenge not found');
    }

    // Mark challenge as completed for user
    await Challenge.markComplete(challengeId, userId);

    // Update progress in associated goal if exists
    if (challenge.goal_id) {
      await Challenge.updateGoalProgress(challenge.goal_id);
    }

    return { success: true, message: 'Challenge completed successfully' };
    return created;
  },

  updateChallenge: async (id, updateData) => {
    const updated = await Challenge.update(id, updateData);
    return updated;
  },

  deleteChallenge: async (id) => {
    return await Challenge.delete(id);
  }
};

module.exports = challengeService;