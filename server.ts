import "dotenv/config";
import connectDB from "./src/shared/config/db";
import logger from "./src/shared/utils/logger";
import app from "./src/app";

connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled rejections (e.g. DB connection issues)
process.on("unhandledRejection", (err: any) => {
  logger.error(`Error: ${err?.message || err}`);
  server.close(() => process.exit(1));
});

export default server;
