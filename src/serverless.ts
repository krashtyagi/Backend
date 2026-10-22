import { Request, Response } from "express";

import connectDB from "./shared/config/db.js";
import app from "./app.js";

export default async function handler(req: Request, res: Response) {
  await connectDB();
  return app(req, res);
}
