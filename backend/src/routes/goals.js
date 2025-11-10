// backend/src/routes/goals.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/goalController');

// GET /api/goals
router.get('/', ctrl.getAllGoals);

// GET /api/goals/:id
router.get('/:id', ctrl.getGoalById);

// POST /api/goals
router.post('/', ctrl.createGoal);

// PUT /api/goals/:id
router.put('/:id', ctrl.updateGoal);

// DELETE /api/goals/:id
router.delete('/:id', ctrl.deleteGoal);

module.exports = router;

