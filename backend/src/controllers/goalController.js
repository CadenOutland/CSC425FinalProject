// TODO: Implement goals CRUD operations controller
const goalController = {
  // Get all goals for user
  getGoals: async (req, res, next) => {
    try {
      const userId = req.user?.id || req.userId;
      if (!userId)
        return res
          .status(401)
          .json({ success: false, error: { message: 'Unauthorized' } });

      // Use model directly for now
      const Goal = require('../models/Goal');
      const goals = await Goal.findByUserId(userId);

      res.json({
        success: true,
        data: { goals },
        message: 'User goals fetched successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  },

  // Get single goal by ID
  getGoalById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const Goal = require('../models/Goal');
      const goal = await Goal.findById(id);

      if (!goal)
        return res
          .status(404)
          .json({ success: false, error: { message: 'Goal not found' } });

      res.json({ success: true, data: { goal }, message: 'Goal fetched' });
    } catch (error) {
      next(error);
    }
  },

  // Create new goal
  createGoal: async (req, res, next) => {
    try {
      const userId = req.user?.id || req.userId;
      const { title, description, targetDate, category } = req.body;
      const Goal = require('../models/Goal');

      const newGoal = await Goal.create({
        title,
        description,
        user_id: userId,
        target_date: targetDate,
        type: category,
      });

      res
        .status(201)
        .json({
          success: true,
          data: { goal: newGoal },
          message: 'Goal created',
        });
    } catch (error) {
      next(error);
    }
  },

  // Update existing goal
  updateGoal: async (req, res, next) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const Goal = require('../models/Goal');
      const updated = await Goal.update(id, updateData);
      res.json({
        success: true,
        data: { goal: updated },
        message: 'Goal updated',
      });
    } catch (error) {
      next(error);
    }
  },

  // Delete goal
  deleteGoal: async (req, res, next) => {
    try {
      const { id } = req.params;
      const Goal = require('../models/Goal');
      const deleted = await Goal.delete(id);
      res.json({
        success: true,
        data: { goal: deleted },
        message: 'Goal deleted',
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = goalController;
