// backend/src/models/MongoRefreshToken.js
const mongoose = require('mongoose');

const RefreshTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  expires_at: Date,
  is_revoked: { type: Boolean, default: false }
}, { timestamps: true });

module.exports =
  mongoose.models.RefreshToken ||
  mongoose.model('RefreshToken', RefreshTokenSchema);
