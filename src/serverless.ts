import { Request, Response } from "express";
import connectDB from "./shared/config/db";
import app from "./app";

let isDbConnected = false;

export default async function handler(req: Request, res: Response) {
  if (!isDbConnected) {
    await connectDB();
    isDbConnected = true;
  }

  return app(req, res);
}
