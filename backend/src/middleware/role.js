// middleware/role.js
const { AppError } = require("./errorHandler");

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission for this action", 403)
      );
    }
    next();
  };
};

module.exports = restrictTo;
