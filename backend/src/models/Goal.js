// backend/src/models/Goal.js
const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  progress: { type: Number, default: 0 }, // 0 - 100
  difficulty: { type: String, default: 'Medium' },
  category: { type: String, default: 'General' },
  targetDate: { type: Date },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  status: { type: String, default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Goal', GoalSchema);

