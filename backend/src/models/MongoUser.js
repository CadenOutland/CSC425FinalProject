// backend/src/models/MongoUser.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password_hash: { type: String, required: true },
  first_name: String,
  last_name: String,
  profile_image: String,
  bio: String,
  is_active: { type: Boolean, default: true },
  is_verified: { type: Boolean, default: false },
  role: { type: String, default: 'student' },
  last_login: Date
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
