const mongoose = require('mongoose');

const ProgressEventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  goalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal' },
  challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' },
  points: { type: Number, default: 0 },
  type: String,
  score: Number,
  completed: { type: Boolean, default: false },
  timeSpent: Number
}, { timestamps: true });

module.exports = mongoose.model('ProgressEvent', ProgressEventSchema);

