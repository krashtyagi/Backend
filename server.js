const dotenv = require("dotenv");
const connectDB = require("./src/shared/config/db");
const logger = require("./src/shared/utils/logger");

dotenv.config();

connectDB();

const app = require("./src/app");

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled rejections (e.g. DB connection issues)
process.on("unhandledRejection", (err) => {
  logger.error(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
