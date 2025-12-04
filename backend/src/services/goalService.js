const Goal = require('../models/Goal');

const goalService = {
  // Get all goals for a user and normalize fields
  getUserGoals: async (userId) => {
    const rows = await Goal.findByUserId(userId);
    // Normalize field names to match frontend expectations
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      user_id: r.user_id,
      category: r.category || null,
      difficulty_level: r.difficulty_level || r.difficulty || 'medium',
      target_date: r.target_date || r.target_completion_date || null,
      is_completed: r.is_completed || false,
      progress: r.progress_percentage || r.progress || 0,
      created_at: r.created_at,
      updated_at: r.updated_at,
    }));
  },

  // Create new goal
  createGoal: async (goalData) => {
    if (!goalData.title) {
      throw new Error('Title is required');
    }

    // Minimal validation already done at controller; ensure fields are in expected DB names
    const dbObj = {
      title: goalData.title,
      description: goalData.description,
      user_id: goalData.user_id,
      target_date:
        goalData.target_date || goalData.target_completion_date || null,
      category: goalData.category || null,
      difficulty_level: goalData.difficulty_level || 'medium',
    };

    const created = await Goal.create(dbObj);
    return {
      id: created.id,
      title: created.title,
      description: created.description,
      user_id: created.user_id,
      category: created.category,
      difficulty_level: created.difficulty_level,
      target_date:
        created.target_date || created.target_completion_date || null,
      is_completed: created.is_completed || false,
      progress: created.progress_percentage || 0,
      created_at: created.created_at,
    };
  },

  getGoalById: async (goalId) => {
    return await Goal.findById(goalId);
  },

  updateGoal: async (goalId, updateData) => {
    // Map frontend keys to DB columns
    const dbUpdate = {
      title: updateData.title,
      description: updateData.description,
      target_date: updateData.target_date || updateData.target_completion_date,
      progress_percentage:
        updateData.progress || updateData.progress_percentage,
      status: updateData.status, // if present
    };

    const updated = await Goal.update(goalId, dbUpdate);
    return {
      id: updated.id,
      title: updated.title,
      description: updated.description,
      user_id: updated.user_id,
      category: updated.category,
      difficulty_level: updated.difficulty_level,
      target_date:
        updated.target_date || updated.target_completion_date || null,
      is_completed: updated.is_completed || false,
      progress: updated.progress_percentage || 0,
      created_at: updated.created_at,
      updated_at: updated.updated_at,
    };
  },

  deleteGoal: async (goalId) => {
    return await Goal.delete(goalId);
  },

  // Calculate completion percentage for a goal (placeholder)
  calculateCompletion: (goal) => {
    // If goal has numeric progress, return it; otherwise compute from challenges (not implemented)
    if (!goal) return 0;
    if (typeof goal.progress === 'number')
      return Math.min(100, Math.max(0, goal.progress));
    if (typeof goal.progress_percentage === 'number')
      return Math.min(100, Math.max(0, goal.progress_percentage));
    return 0;
  },

  // Increment goal progress by percentage based on difficulty
  incrementGoalProgress: async (goalId, difficulty) => {
    const increments = {
      'easy': 5,
      'beginner': 5,
      'intermediate': 10,
      'medium': 10,
      'advanced': 15,
      'hard': 15,
    };
    const increment = increments[difficulty?.toLowerCase()] || 5;

    const goal = await Goal.findById(goalId);
    if (!goal) {
      throw new Error('Goal not found');
    }

    const currentProgress = goal.progress_percentage || 0;
    const newProgress = Math.min(100, currentProgress + increment);
    const completedJustNow = currentProgress < 100 && newProgress >= 100;

    const updated = await Goal.update(goalId, {
      progress_percentage: newProgress,
      is_completed: newProgress >= 100,
    });

    // Attach helper metadata
    return { ...updated, completedJustNow, previousProgress: currentProgress };
  },
};

module.exports = goalService;
