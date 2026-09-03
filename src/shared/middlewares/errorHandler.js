const logger = require('../utils/logger');

exports.errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message =
    err.message ||
    err.error?.description ||
    err.description ||
    (typeof err === "string" ? err : null) ||
    'Server Error';
  
  logger.error(message, { stack: err.stack, error: err.error || err });

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};