// backend/src/middleware/auth.js
const jwt = require('jsonwebtoken');
const { AppError } = require('./errorHandler');
const mongo = require('../database/mongo');
const User = require('../models/MongoUser');

module.exports = async function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Authorization token missing", 401, "NO_TOKEN");
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Ensure connection
    if (!mongo.mongoose.connection.readyState) {
      await mongo.connect();
    }

    const user = await User.findById(payload.id).lean();
    if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND");

    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role
    };

    next();
  } catch (err) {
    next(err);
  }
};
