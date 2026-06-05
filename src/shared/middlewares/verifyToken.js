const jwt = require("jsonwebtoken");
const User = require("../../modules/auth/auth.model");
const logger = require("../utils/logger");

exports.protect = async (req, res, next) => {
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
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

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

    next();
  } catch (error) {
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
exports.optionalProtect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(); //guest user, allow access
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

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
