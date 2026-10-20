import jwt from "jsonwebtoken";
import User from "../../modules/auth/auth.model.js";
import Vendor from "../../modules/vendors/vendor.model.js";
import logger from "../utils/logger.js";
import { Request, Response, NextFunction } from "express";

export const protect = async (req: any, res: any, next: NextFunction) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token provided",
      });
    }

    // VERIFY TOKEN
    const decoded: any = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);

    // FIND USER
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "The user belonging to this token no longer exists",
      });
    }

    req.user = currentUser;
    req.vendorId = decoded.vendorId || null;

    if (!req.vendorId && (currentUser.role === "vendor" || currentUser.isVendor)) {
      const vendor = await Vendor.findOne({ userId: currentUser._id }).select("_id");
      if (vendor) {
        req.vendorId = vendor._id;
      }
    }

    next();
  } catch (error: any) {
    logger.error("Auth Middleware Error:", error.message);

    const message =
      error.name === "TokenExpiredError"
        ? "Token expired, please login again"
        : "Invalid token, authorization denied";

    return res.status(401).json({
      success: false,
      message,
    });
  }
};

export const optionalProtect = async (req: any, res: any, next: NextFunction) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(); //guest user, allow access
    }

    const decoded: any = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);

    const currentUser = await User.findById(decoded.id);

    if (currentUser) {
      req.user = currentUser;
    }

    next();
  } catch (error) {
    //If token invalid, treat as guest
    next();
  }
};
