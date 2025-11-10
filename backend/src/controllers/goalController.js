const goalService = require('../services/goalService');
const { AppError } = require('../middleware/errorHandler');

const goalController = {
  // Get all goals for authenticated user
  getGoals: async (req, res, next) => {
    try {
      const {
        category,
        status,
        difficulty,
        limit = 20,
        offset = 0,
      } = req.query;
      const userId = req.user.id;

      const goals = await goalService.getGoals(userId, {
        category,
        status,
        difficulty,
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      res.json({
        success: true,
        data: {
          goals: goals.rows,
          pagination: {
            total: parseInt(goals.count),
            limit: parseInt(limit),
            offset: parseInt(offset),
            hasMore: goals.rows.length === parseInt(limit),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // Get single goal by ID
  getGoalById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const goal = await goalService.getGoalById(id, userId);
      if (!goal) {
        return next(new AppError('Goal not found', 404, 'GOAL_NOT_FOUND'));
      }

      res.json({
        success: true,
        data: { goal },
      });
    } catch (error) {
      next(error);
    }
  },

  // Create new goal
  createGoal: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const goalData = {
        ...req.body,
        userId,
      };

      const goal = await goalService.createGoal(goalData);

      res.status(201).json({
        success: true,
        data: { goal },
        message: 'Goal created successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  // Update existing goal
  updateGoal: async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const updates = req.body;

      const goal = await goalService.updateGoal(id, userId, updates);
      if (!goal) {
        return next(new AppError('Goal not found', 404, 'GOAL_NOT_FOUND'));
      }

      res.json({
        success: true,
        data: { goal },
        message: 'Goal updated successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  // Delete goal
  deleteGoal: async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const success = await goalService.deleteGoal(id, userId);
      if (!success) {
        return next(new AppError('Goal not found', 404, 'GOAL_NOT_FOUND'));
      }

      res.json({
        success: true,
        message: 'Goal deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = goalController;
