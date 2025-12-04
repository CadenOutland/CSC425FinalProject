const Challenge = require('../models/Challenge');

const challengeService = {
  // Get challenges; support simple filters object { difficulty, category, search, userId }
  getChallenges: async (filters = {}) => {
    // For now, ignore complex filtering and return all challenges then filter in JS
    const rows = await Challenge.findAll();
    // Filter by created_by if userId is provided
    let filtered = rows;
    if (filters.userId) {
      filtered = rows.filter((r) => r.created_by === String(filters.userId));
    }

    // Apply additional filters
    filtered = filtered.filter((r) => {
      if (
        filters.difficulty &&
        (r.difficulty || r.difficulty_level || '').toLowerCase() !==
          filters.difficulty.toLowerCase()
      )
        return false;
      if (
        filters.category &&
        (r.category || r.subject || '').toLowerCase() !==
          filters.category.toLowerCase()
      )
        return false;
      if (filters.search) {
        const s = filters.search.toLowerCase();
        const inTitle = String(r.title || '')
          .toLowerCase()
          .includes(s);
        const inDesc = String(r.description || '')
          .toLowerCase()
          .includes(s);
        const inTags = (r.tags || []).some((t) =>
          String(t).toLowerCase().includes(s)
        );
        if (!inTitle && !inDesc && !inTags) return false;
      }
      return true;
    });

    return filtered.map((r) => ({
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
    // Map incoming API shape to DB column names expected by Challenge.create
    const dbObj = {
      title: data.title,
      description: data.description,
      // DB expects `instructions` and `category`, `difficulty_level`, `points_reward`
      instructions: data.instructions || data.content || data.description || '',
      category: data.category || data.subject || 'General',
      difficulty_level: data.difficulty || data.difficulty_level || 'medium',
      points_reward: data.points || data.points_reward || 10,
      type: data.type || null,
      estimated_time_minutes:
        data.estimatedTime || data.estimated_time_minutes || null,
      created_by: data.userId || data.created_by || null,
    };

    return await Challenge.create(dbObj);
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
  },

  updateChallenge: async (id, updateData) => {
    const updated = await Challenge.update(id, updateData);
    return updated;
  },

  deleteChallenge: async (id) => {
    return await Challenge.delete(id);
  },
};

module.exports = challengeService;
