// backend/src/middleware/validation.js
const { AppError } = require('./errorHandler');

const validation = {
  registerValidation: (req, res, next) => {
    const { email, password, firstName, lastName } = req.body;

    if (!email) return next(new AppError("Email is required", 400));
    if (!password) return next(new AppError("Password is required", 400));
    if (!firstName || !lastName) {
      return next(new AppError("First and last name are required", 400));
    }

    next();
  },

  loginValidation: (req, res, next) => {
    const { email, password } = req.body;

    if (!email) return next(new AppError("Email is required", 400));
    if (!password) return next(new AppError("Password is required", 400));

    next();
  }
};

module.exports = validation;

