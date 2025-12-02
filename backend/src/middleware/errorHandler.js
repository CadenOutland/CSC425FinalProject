// backend/src/middleware/errorHandler.js
class AppError extends Error {
  constructor(message, statusCode = 500, code = 'SERVER_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

const errorHandler = (err, req, res, next) => {
  console.error("❌ ERROR:", err);

  const status = err.statusCode || 500;

  res.status(status).json({
    error: err.code || 'SERVER_ERROR',
    message: err.message || 'Internal Server Error',
    status,
    timestamp: new Date().toISOString()
  });
};

module.exports = errorHandler;
module.exports.AppError = AppError;

