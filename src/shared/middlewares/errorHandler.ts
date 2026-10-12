import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger.js";

interface CustomError extends Error {
  statusCode?: number;
  error?: any;
  errors?: Record<string, { message: string }>;
  path?: string;
  description?: string;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  let statusCode = err.statusCode || 500;
  let message =
    err.message ||
    err.error?.description ||
    err.description ||
    (typeof err === "string" ? err : null) ||
    "Server Error";

  if (err.name === "ValidationError") {
    statusCode = 400;
    message =
      Object.values(err.errors || {})
        .map((val) => val.message)
        .join(", ") || err.message;
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ID format for ${err.path || "resource"}`;
  }

  logger.error(message, { stack: err.stack, error: err.error || err });

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
