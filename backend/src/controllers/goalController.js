const goalService = require('../services/goalService');
const { AppError } = require('../middleware/errorHandler');

const goalController = {
  // GET /goals
  getGoals: async (req, res, next) => {
    try {
      const goals = await goalService.getUserGoals(req.user.id);

      res.json({
        message: 'Goals fetched successfully',
        goals,
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /goals/:id
  getGoalById: async (req, res, next) => {
    try {
      const goal = await goalService.getGoalById(req.params.id);

      if (!goal) throw new AppError('Goal not found', 404);

      res.json({ goal });
    } catch (err) {
      next(err);
    }
  },

  // POST /goals
  createGoal: async (req, res, next) => {
    try {
      const data = {
        ...req.body,
        user_id: req.user.id,
      };

      const created = await goalService.createGoal(data);

      res.status(201).json({
        message: 'Goal created successfully',
        goal: created,
      });
    } catch (err) {
      next(err);
    }
  },

  // PUT /goals/:id
  updateGoal: async (req, res, next) => {
    try {
      const updated = await goalService.updateGoal(req.params.id, req.body);

      res.json({
        message: 'Goal updated successfully',
        goal: updated,
      });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /goals/:id
  deleteGoal: async (req, res, next) => {
    try {
      await goalService.deleteGoal(req.params.id);

      res.json({
        message: 'Goal deleted successfully',
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = goalController;
