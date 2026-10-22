import { Request, Response } from "express";

import connectDB from "./shared/config/db.js";
import app from "./app.js";

let isDbConnected = false;

export default async function handler(req: Request, res: Response) {
  if (!isDbConnected) {
    await connectDB();
    isDbConnected = true;
  }

  return app(req, res);
}
