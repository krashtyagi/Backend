import mongoose from "mongoose";
import logger from "../utils/logger";

let isConnected = false;

const connectDB = async (): Promise<void> => {
  if (isConnected) {
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string, {
      bufferCommands: false,
    });

    isConnected = conn.connections[0].readyState === 1;
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    const err = error as Error;
    logger.error(`Error: ${err.message}`);
    throw err;
  }
};

export default connectDB;
