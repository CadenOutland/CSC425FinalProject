// Goals CRUD controller
const goalService = require('../services/goalService');

const goalController = {
  // Get all goals for authenticated user
  getGoals: async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: 'Unauthorized' });

      const goals = await goalService.getUserGoals(userId);
      return res.json({ data: goals });
    } catch (error) {
      next(error);
    }
  },

  // Get single goal by id (must belong to user)
  getGoalById: async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const goalId = req.params.id;

      if (!userId) return res.status(401).json({ message: 'Unauthorized' });

      const goal = await goalService.getGoalById(goalId);
      if (!goal || Number(goal.user_id) !== Number(userId)) {
        return res.status(404).json({ message: 'Goal not found' });
      }

      return res.json({ data: goal });
    } catch (error) {
      next(error);
    }
  },

  // Create new goal
  createGoal: async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: 'Unauthorized' });

      const { title, description, target_date, category, difficulty_level } = req.body;
      if (!title || title.trim() === '') {
        return res.status(400).json({ message: 'Title is required' });
      }

      const goalData = {
        title: title.trim(),
        description: description || null,
        target_date: target_date || null,
        category: category || null,
        difficulty_level: difficulty_level || 'medium',
        user_id: userId,
      };

      const created = await goalService.createGoal(goalData);
      return res.status(201).json({ data: created });
    } catch (error) {
      next(error);
    }
  },

  // Update existing goal
  updateGoal: async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const goalId = req.params.id;
      if (!userId) return res.status(401).json({ message: 'Unauthorized' });

      const existing = await goalService.getGoalById(goalId);
      if (!existing || Number(existing.user_id) !== Number(userId)) {
        return res.status(404).json({ message: 'Goal not found' });
      }

      const updateData = req.body || {};
      const updated = await goalService.updateGoal(goalId, updateData);
      return res.json({ data: updated });
    } catch (error) {
      next(error);
    }
  },

  // Delete goal
  deleteGoal: async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const goalId = req.params.id;
      if (!userId) return res.status(401).json({ message: 'Unauthorized' });

      const existing = await goalService.getGoalById(goalId);
      if (!existing || Number(existing.user_id) !== Number(userId)) {
        return res.status(404).json({ message: 'Goal not found' });
      }

      await goalService.deleteGoal(goalId);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};

module.exports = goalController;