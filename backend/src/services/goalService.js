const Goal = require('../models/Goal');
const { AppError } = require('../middleware/errorHandler');

const goalService = {

  getUserGoals: async (userId) => {
    const rows = await Goal.findByUserId(userId);

    return rows.map(g => ({
      id: g.id,
      title: g.title,
      description: g.description,
      user_id: g.user_id,
      category: g.category,
      difficulty_level: g.difficulty_level,
      target_date: g.target_date || g.target_completion_date,
      is_completed: g.is_completed,
      progress: g.progress_percentage,
      points_reward: g.points_reward,
      created_at: g.created_at,
      updated_at: g.updated_at
    }));
  },

  createGoal: async (goalData) => {
    if (!goalData.title) throw new AppError('Title is required', 400);

    const dbObj = {
      title: goalData.title,
      description: goalData.description,
      user_id: goalData.user_id,
      target_date: goalData.target_date || null,
      category: goalData.category || null,
      difficulty_level: goalData.difficulty_level || 'medium'
    };

    const created = await Goal.create(dbObj);

    return {
      id: created.id,
      title: created.title,
      description: created.description,
      user_id: created.user_id,
      category: created.category,
      difficulty_level: created.difficulty_level,
      target_date: created.target_date,
      is_completed: created.is_completed,
      progress: created.progress_percentage,
      created_at: created.created_at
    };
  },

  getGoalById: async (goalId) => {
    const goal = await Goal.findById(goalId);
    if (!goal) throw new AppError('Goal not found', 404);
    return goal;
  },

  updateGoal: async (goalId, updateData) => {
    const dbUpdate = {
      title: updateData.title,
      description: updateData.description,
      target_date: updateData.target_date,
      progress: updateData.progress_percentage,
      status: updateData.status
    };

    const updated = await Goal.update(goalId, dbUpdate);
    return updated;
  },

  deleteGoal: async (goalId) => {
    return await Goal.delete(goalId);
  },

  calculateCompletion: (goal) => {
    return Number(goal.progress_percentage || 0);
  }
};

module.exports = goalService;
