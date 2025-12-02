// backend/src/routes/goals.js
const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');
const auth = require('../middleware/auth');

// Get all goals
router.get('/', auth, goalController.getGoals);

// Single goal
router.get('/:id', auth, goalController.getGoalById);

// Create
router.post('/', auth, goalController.createGoal);

// Update
router.put('/:id', auth, goalController.updateGoal);

// Delete
router.delete('/:id', auth, goalController.deleteGoal);

module.exports = router;

