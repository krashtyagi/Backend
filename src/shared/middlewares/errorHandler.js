const logger = require('../utils/logger');

exports.errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  logger.error(err.message, { stack: err.stack });

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};