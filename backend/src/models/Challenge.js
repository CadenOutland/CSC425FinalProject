const mongoose = require('mongoose');

const ChallengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: String,
  difficulty: { type: String, default: 'Medium' },
  points: { type: Number, default: 0 },
  estimatedTime: Number,
  tags: [String],
  subject: String,
  content: mongoose.Schema.Types.Mixed
}, { timestamps: true });

module.exports = mongoose.model('Challenge', ChallengeSchema);

