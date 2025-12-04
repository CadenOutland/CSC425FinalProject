const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password_hash: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  profile_image: { type: String },
  bio: { type: String },
  location: { type: String },
  website: { type: String },
  is_active: { type: Boolean, default: true },
  is_verified: { type: Boolean, default: false },
  role: { type: String, default: 'student' },
  last_login: { type: Date },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
