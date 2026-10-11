import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: any;
      vendorId?: any;
      file?: any;
      files?: any;
    }
  }
}

export {};
