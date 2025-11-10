// backend/src/controllers/goalController.js
const Goal = require('../models/Goal');

/**
 * GET /api/goals
 */
async function getAllGoals(req, res) {
  try {
    const docs = await Goal.find().sort({ createdAt: -1 }).lean().exec();
    return res.json(docs);
  } catch (err) {
    console.error('getAllGoals error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

/**
 * GET /api/goals/:id
 */
async function getGoalById(req, res) {
  try {
    const doc = await Goal.findById(req.params.id).lean().exec();
    if (!doc) return res.status(404).json({ message: 'Not found' });
    return res.json(doc);
  } catch (err) {
    console.error('getGoalById error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

/**
 * POST /api/goals
 */
async function createGoal(req, res) {
  try {
    const { title, description, targetDate, difficulty, category, userId, progress } = req.body;
    if (!title) return res.status(400).json({ message: 'title is required' });

    const g = new Goal({
      title,
      description: description || '',
      targetDate: targetDate || null,
      difficulty: difficulty || 'Medium',
      category: category || 'General',
      userId,
      progress: typeof progress === 'number' ? progress : 0
    });
    const saved = await g.save();
    return res.status(201).json(saved);
  } catch (err) {
    console.error('createGoal error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

/**
 * PUT /api/goals/:id
 */
async function updateGoal(req, res) {
  try {
    const updated = await Goal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).lean().exec();
    if (!updated) return res.status(404).json({ message: 'Not found' });
    return res.json(updated);
  } catch (err) {
    console.error('updateGoal error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

/**
 * DELETE /api/goals/:id
 */
async function deleteGoal(req, res) {
  try {
    await Goal.findByIdAndDelete(req.params.id).exec();
    return res.status(204).end();
  } catch (err) {
    console.error('deleteGoal error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  getAllGoals,
  getGoalById,
  createGoal,
  updateGoal,
  deleteGoal
};

