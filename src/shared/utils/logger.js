const winston = require("winston");

const transports = [
  new winston.transports.Console({
    format:
      process.env.NODE_ENV === "production"
        ? winston.format.json()
        : winston.format.simple(),
  }),
];

// In production (Vercel / serverless), filesystem is read-only.
// Only write to local file logs in development environments outside Vercel.
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  try {
    transports.push(
      new winston.transports.File({
        filename: "logs/error.log",
        level: "error",
      }),
      new winston.transports.File({
        filename: "logs/combined.log",
      })
    );
  } catch (err) {
    // Ignore file transport errors in environments where logs directory cannot be accessed
  }
}

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports,
});

module.exports = logger;